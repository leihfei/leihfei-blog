<template><div><h1 id="多线程高级笔记" tabindex="-1"><a class="header-anchor" href="#多线程高级笔记" aria-hidden="true">#</a> 多线程高级笔记</h1>
<h1 id="笔记主要内容" tabindex="-1"><a class="header-anchor" href="#笔记主要内容" aria-hidden="true">#</a> 笔记主要内容</h1>
<p>记录相关并发工具类</p>
<ol>
<li>并发安全： 互斥同步、非互斥同步、无同步方案</li>
<li>管理线程、提供效率</li>
<li>线程写作</li>
</ol>
<h1 id="_1-线程池" tabindex="-1"><a class="header-anchor" href="#_1-线程池" aria-hidden="true">#</a> 1. 线程池</h1>
<p>​	<strong>线程:</strong> 程序执行流的最小执行单位，是行程中的实际运作单位，经常容易和进程这个概念混淆。那么，线程和进程究竟有什么区别呢？首先，进程是一个动态的过程，是一个活动的实体。简单来说，一个应用程序的运行就可以被看做是一个进程，而线程，是运行中的实际的任务执行者。可以说，进程中包含了多个可以同时运行的线程。</p>
<p>​	<strong>线程池：</strong> Java中开辟出了一种管理线程的概念，这个概念叫做线程池，从概念以及应用场景中，我们可以看出，线程池的好处，就是可以方便的管理线程，也可以减少内存的消耗。</p>
<p>​		好处： 加快响应速度、合理利用CPU和内存、统一管理资源任务</p>
<p>​		使用场合： 服务器接收大量请求、开放中创建大量线程请求</p>
<h2 id="_1-创建和停止线程池" tabindex="-1"><a class="header-anchor" href="#_1-创建和停止线程池" aria-hidden="true">#</a> 1. 创建和停止线程池</h2>
<p>​	构造函数的参数：</p>
<table>
<thead>
<tr>
<th>参数名</th>
<th>类型</th>
<th>含义</th>
</tr>
</thead>
<tbody>
<tr>
<td>corePoolSize</td>
<td>int</td>
<td>核心线程数</td>
</tr>
<tr>
<td>maximumPoolSize</td>
<td>int</td>
<td>最大线程数</td>
</tr>
<tr>
<td>keepAliveTime</td>
<td>long</td>
<td>保持存活时间</td>
</tr>
<tr>
<td>workQueue</td>
<td>BlockingQueue</td>
<td>任务存储队列</td>
</tr>
<tr>
<td>threadFactory</td>
<td>ThreadFactory</td>
<td>当线程池需要新线程的时候，会使用ThreadFactory来生成线程</td>
</tr>
<tr>
<td>Handler</td>
<td>RejectedExecutionHandler</td>
<td>当线程池无法接收所提交的任务的拒绝策略</td>
</tr>
</tbody>
</table>
<ul>
<li>
<p>corePoolSize-核心线程数： 线程池在完成初始化之后，默认情况下，线程池中并没有任何线程，线程池会等待有任务到来时，在创建新线程执行任务。</p>
</li>
<li>
<p>maximumPoolSize-最大线程数：线程池有可能在线程核心数的基础上，额外的增加一些线程，但是这些线程增加也有一个上限，限定值就是maxPoolSize.</p>
</li>
<li>
<p>keepAliveTime-保持存活时间： 如果线程池当前的线程数多于corePoolSize,那么如果多于的线程空闲时间超过了keepAliveTime,他们会被回收</p>
</li>
<li>
<p>workQueue: 工作队列：</p>
<ul>
<li>直接交换： SynchronousQueue</li>
<li>无界队列： LinkedBlockingQueue</li>
<li>有界队列：ArrayBlockingQueue</li>
<li>延时队列：DelayedWorkQueue</li>
<li>优先级队列,无阻塞：PriorityBlockingQueue</li>
</ul>
</li>
<li>
<p>拒绝策略</p>
<ul>
<li>
<p>AbortPolicy</p>
<p>默认的拒绝策略，即丢弃任务并抛出RejectedExecutionException异常</p>
<p>如果是比较关键的业务，推荐使用此拒绝策略，这样子在系统不能承载更大的并发量的时候，能够及时的通过异常发现。</p>
</li>
<li>
<p>DiscardPolicy</p>
<p>ThreadPoolExecutor.DiscardPolicy：丢弃任务，但是不抛出异常。如果线程队列已满，则后续提交的任务都会被丢弃，且是静默丢弃。</p>
<p>使用此策略，可能会使我们无法发现系统的异常状态。建议是一些无关紧要的业务采用此策略。例如，博客网站统计阅读量就是采用的这种拒绝策略。</p>
</li>
<li>
<p>DiscardOldestPolicy</p>
<p>ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新提交被拒绝的任务。</p>
<p>此拒绝策略，是一种喜新厌旧的拒绝策略。是否要采用此种拒绝策略，还得根据实际业务是否允许丢弃老任务来认真衡量。</p>
</li>
<li>
<p>CallerRunsPolicy</p>
<p>ThreadPoolExecutor.CallerRunsPolicy：由调用线程执行该任务。拒绝了，让调用方线程来执行任务，并且可以让提交任务速度降低</p>
</li>
</ul>
</li>
</ul>
<h3 id="线程添加规则" tabindex="-1"><a class="header-anchor" href="#线程添加规则" aria-hidden="true">#</a> 线程添加规则</h3>
<ol>
<li>
<p>如果线程数小于corePoolSize,即使其他线程处于空闲状态，也会创建一个新的线程来执行新任务。</p>
</li>
<li>
<p>如果线程数等于或大于corePoolSize，但小于maximumPoolSize，则将任务放入队列。</p>
</li>
<li>
<p>如果队列已满，当线线程数小于maximumPoolSize,那么创建新的线程来执行任务。</p>
</li>
<li>
<p>如果队列已满，并且线程数大于或等于maximumPoolSize,那么执行拒绝任务。</p>
<p>流程图如下：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201033400.png" alt="线程池任务执行流程图"></p>
</li>
</ol>
<h3 id="增减线程的特点" tabindex="-1"><a class="header-anchor" href="#增减线程的特点" aria-hidden="true">#</a> 增减线程的特点</h3>
<ol>
<li>通过设置corePoolSize和maximumPoolSize相同，就可以创建固定大小的线程池。</li>
<li>线程池希望保持较少的线程数，并且只有负载变得很大的时候才增加它</li>
<li>通过设置maximumPoolSize为很高的值，如Integer.MAX_VALUE,可以允许线程池容纳任意数量的并发任务</li>
<li>当只有在队列填满的时候才创建多余corePoolSize的线程，所以如果使用了无界队列（LinkedBlockingQueue），那么线程数就不会超过corePoolSize</li>
</ol>
<h3 id="线程池有哪几种工作队列" tabindex="-1"><a class="header-anchor" href="#线程池有哪几种工作队列" aria-hidden="true">#</a> 线程池有哪几种工作队列？</h3>
<p>1、ArrayBlockingQueue</p>
<p>是一个基于数组结构的有界阻塞队列，此队列按 FIFO（先进先出）原则对元素进行排序。</p>
<p>2、LinkedBlockingQueue</p>
<p>一个基于链表结构的阻塞队列，此队列按FIFO （先进先出） 排序元素，吞吐量通常要高于ArrayBlockingQueue。静态工厂方法Executors.newFixedThreadPool()使用了这个队列</p>
<p>3、SynchronousQueue</p>
<p>一个不存储元素的阻塞队列。每个插入操作必须等到另一个线程调用移除操作，否则插入操作一直处于阻塞状态，吞吐量通常要高于LinkedBlockingQueue，静态工厂方法Executors.newCachedThreadPool使用了这个队列。</p>
<p>4、PriorityBlockingQueue</p>
<p>一个具有优先级的无限阻塞队列。</p>
<h3 id="线程创建jdk提供几种方式" tabindex="-1"><a class="header-anchor" href="#线程创建jdk提供几种方式" aria-hidden="true">#</a> 线程创建JDK提供几种方式</h3>
<h4 id="_1-newfixedthreadpool-单线程化的executor" tabindex="-1"><a class="header-anchor" href="#_1-newfixedthreadpool-单线程化的executor" aria-hidden="true">#</a> 1.newFixedThreadPool 单线程化的Executor</h4>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-19
 * newFixedThreadPool
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">FixedThreadPoolDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            executorService<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Task1</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Task1</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span><span class="token punctuation">{</span>
        <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">public</span> <span class="token class-name">Task1</span><span class="token punctuation">(</span><span class="token keyword">int</span> _i<span class="token punctuation">)</span><span class="token punctuation">{</span>
            i <span class="token operator">=</span> _i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"  i="</span> <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>源码分析</strong>：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ExecutorService</span> <span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token keyword">int</span> nThreads<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span>nThreads<span class="token punctuation">,</span> nThreads<span class="token punctuation">,</span>
                                      <span class="token number">0L</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MILLISECONDS</span><span class="token punctuation">,</span>
                                      <span class="token keyword">new</span> <span class="token class-name">LinkedBlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Runnable</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">//主要为： 创建了corePoolSize和maxPoolSize相等大小的线程池，并且keepAliveTime为0，队列为无界队列</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**注意： **由于传进去的LinkedBlockingQueue是没有容量限制，所有当请求越来越多的时候，并且无法及时处理完毕，也就是请求堆积的时候，会容易造成OOM。</p>
<h4 id="_2-newsinglethreadexecutor-固定数目线程的线程池-队列数没有限制" tabindex="-1"><a class="header-anchor" href="#_2-newsinglethreadexecutor-固定数目线程的线程池-队列数没有限制" aria-hidden="true">#</a> 2. newSingleThreadExecutor 固定数目线程的线程池（队列数没有限制）</h4>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-19
 * newSingleThreadExecutor 就是单独线程
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> newSingleThreadExecutorDemo <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newSingleThreadExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            executorService<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">FixedThreadPoolDemo<span class="token punctuation">.</span>Task1</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Task1</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Task1</span><span class="token punctuation">(</span><span class="token keyword">int</span> _i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            i <span class="token operator">=</span> _i<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"  i="</span> <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
输出结果： 
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">1</span>  i<span class="token operator">=</span><span class="token number">926</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">1</span>  i<span class="token operator">=</span><span class="token number">927</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">1</span>  i<span class="token operator">=</span><span class="token number">928</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">1</span>  i<span class="token operator">=</span><span class="token number">929</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">1</span>  i<span class="token operator">=</span><span class="token number">930</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>源码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ExecutorService</span> <span class="token function">newSingleThreadExecutor</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">FinalizableDelegatedExecutorService</span>
            <span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">,</span>
                                    <span class="token number">0L</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">MILLISECONDS</span><span class="token punctuation">,</span>
                                    <span class="token keyword">new</span> <span class="token class-name">LinkedBlockingQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Runnable</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>结论：</strong> newSingleThreadExecutor和newFixedThreadExecutor原理是一样的，只是将corePoolSize和maxPoolSize设置为固定大小，也同样会造成OOM。</p>
<h4 id="_3-newcachedthreadpool-可缓存的线程池-线程数没有限制" tabindex="-1"><a class="header-anchor" href="#_3-newcachedthreadpool-可缓存的线程池-线程数没有限制" aria-hidden="true">#</a> 3.newCachedThreadPool 可缓存的线程池（线程数没有限制）</h4>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-19
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CachedThreadPoolDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newCachedThreadPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">1000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            executorService<span class="token punctuation">.</span><span class="token function">execute</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
输出结果： 
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">94</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">13</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">198</span>
pool<span class="token operator">-</span><span class="token number">1</span><span class="token operator">-</span>thread<span class="token operator">-</span><span class="token number">93</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>源码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">ExecutorService</span> <span class="token function">newCachedThreadPool</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">,</span>
                                      <span class="token number">60L</span><span class="token punctuation">,</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">,</span>
                                      <span class="token keyword">new</span> <span class="token class-name">SynchronousQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Runnable</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**结论：**看出没有corePoolSize,maxPoolSize还是整形的最大值，workQueue是直接交换队列，那么就会一个任务直接创建一个线程来直接处理。</p>
<h4 id="_4-newscheduledthreadpool支持定时及周期性的任务执行的线程池" tabindex="-1"><a class="header-anchor" href="#_4-newscheduledthreadpool支持定时及周期性的任务执行的线程池" aria-hidden="true">#</a> 4.newScheduledThreadPool支持定时及周期性的任务执行的线程池</h4>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ScheduledExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">TimeUnit</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-19
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ScheduleThreadPoolDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ScheduledExecutorService</span> scheduledExecutorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newScheduledThreadPool</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 延时之后，定时执行任务</span>
<span class="token comment">//        scheduledExecutorService.scheduleAtFixedRate(() -></span>
<span class="token comment">//                        System.out.println(Thread.currentThread().getName()),</span>
<span class="token comment">//                1,</span>
<span class="token comment">//                3,</span>
<span class="token comment">//                TimeUnit.SECONDS);</span>

<span class="token comment">//        scheduledExecutorService.schedule(() -></span>
<span class="token comment">//                        System.out.println(Thread.currentThread().getName()),</span>
<span class="token comment">//                1,</span>
<span class="token comment">//                TimeUnit.SECONDS);</span>

        <span class="token comment">// 延时之后，执行任务，并且delay指的是上一个任务执行结束之后，delay时间之后在执行新的任务</span>
        scheduledExecutorService<span class="token punctuation">.</span><span class="token function">scheduleWithFixedDelay</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token number">0</span><span class="token punctuation">,</span>
                <span class="token number">3</span><span class="token punctuation">,</span>
                <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>源码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>    <span class="token keyword">public</span> <span class="token class-name">ScheduledThreadPoolExecutor</span><span class="token punctuation">(</span><span class="token keyword">int</span> corePoolSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>corePoolSize<span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token constant">NANOSECONDS</span><span class="token punctuation">,</span>
              <span class="token keyword">new</span> <span class="token class-name">DelayedWorkQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意</strong>：</p>
<p>scheduleAtFixedRate： 表示延时后，定时执行任务</p>
<p>scheduleWithFixedDelay: 表示延时后，当上一个任务执行完毕之后，延时delay时间后执行新的任务</p>
<h4 id="_5-workstealingpool" tabindex="-1"><a class="header-anchor" href="#_5-workstealingpool" aria-hidden="true">#</a> 5. workStealingPool</h4>
<p>​	特点： 子任务，窃取数据、相互配合</p>
<p>​	使用场景： 递归</p>
<h4 id="submit和execute的区别" tabindex="-1"><a class="header-anchor" href="#submit和execute的区别" aria-hidden="true">#</a> submit和execute的区别</h4>
<p>execute适用于不需要关注返回值的场景，只需要将线程丢到线程池中去执行就可以了。</p>
<p>submit方法适用于需要关注返回值的场景</p>
<h3 id="设置线程池中的线程数多少合适" tabindex="-1"><a class="header-anchor" href="#设置线程池中的线程数多少合适" aria-hidden="true">#</a> 设置线程池中的线程数多少合适?</h3>
<ul>
<li>CPU密集型（加密，计算Hash等）： 最佳线程数为CPU核心数的1-2倍</li>
<li>耗时IO型（读写文件，网络等）： 最佳线程数一般会大于CPU核心很多倍，以JVM线程监控显示繁忙情况为依据，保证线程空闲可以衔接上，参考Brain Goetz推荐的设置方法： *<em>线程数=CPU核心数 <em>（1+平均等待时间/平均工作时间）</em></em></li>
<li>根据程序进行压测得到数据，在进行设置</li>
</ul>
<h3 id="线程是自动还是手动创建好" tabindex="-1"><a class="header-anchor" href="#线程是自动还是手动创建好" aria-hidden="true">#</a> 线程是自动还是手动创建好？</h3>
<p><strong>建议线程池手动创建</strong>，可以自己控制核心数等，队列，灵活控制</p>
<h2 id="_2-常见的线程池的特点和用法" tabindex="-1"><a class="header-anchor" href="#_2-常见的线程池的特点和用法" aria-hidden="true">#</a> 2. 常见的线程池的特点和用法</h2>
<h3 id="参数情况" tabindex="-1"><a class="header-anchor" href="#参数情况" aria-hidden="true">#</a> 参数情况</h3>
<table>
<thead>
<tr>
<th>参数</th>
<th>FixedThreadPool</th>
<th>CachedThreadPool</th>
<th>ScheduledThreadPool</th>
<th>SingleThreaded</th>
</tr>
</thead>
<tbody>
<tr>
<td>corePoolSize</td>
<td>构造器传递</td>
<td>0</td>
<td>构造器传递</td>
<td>1</td>
</tr>
<tr>
<td>maxPoolSzie</td>
<td>跟corePoolSize一致</td>
<td>Integer.MAX_VALUE</td>
<td>Integer.MAX_VALUE</td>
<td>1</td>
</tr>
<tr>
<td>keepAliveTime</td>
<td>0 seconds</td>
<td>60 seconds</td>
<td>0 seconds</td>
<td>0 seconds</td>
</tr>
<tr>
<td>workQueue</td>
<td>LinkedBlockingQueue</td>
<td>SynchronousQueue</td>
<td>DelayedWorkQueue</td>
<td>LinkedBlockingQueue</td>
</tr>
</tbody>
</table>
<p>FixedThreadPool和SingleThreaded为什么选择LinkedBlockingQueue作为工作队列？</p>
<p>​	原因： 因为Fixed,Single线程池都需要借助LinkedBlockingQueue来满足大量任务的情况。</p>
<p>CachedThreadPool为什么选择SynchronousQueue作为工作队列？</p>
<p>​	原因： 不需要将任务放入队列中，每次都是产生新的线程来直接处理。</p>
<p>ScheduledThreadPool为什么选择DelayedWorkQueue作为工作队列？</p>
<p>​	原因： DelayedWorkQueue是延时队列。</p>
<h3 id="停止线程的正确方法" tabindex="-1"><a class="header-anchor" href="#停止线程的正确方法" aria-hidden="true">#</a> 停止线程的正确方法</h3>
<ul>
<li>
<p>shutdown</p>
<p>优雅的关闭线程池，shutdown停止之后，线程池会继续执行原来已经提交的任务，但是拒绝shutdown之后的任务，抛出异常。可以调用isShutdown来查看</p>
</li>
<li>
<p>isShutdown</p>
<p>判断是否调用shutdown</p>
</li>
<li>
<p>isTerminated</p>
<p>判断整个程序时候结束</p>
</li>
<li>
<p>awaitTermination</p>
<p>检测多少时间之后线程池是否结束,返回true/false</p>
</li>
<li>
<p>shutdownNow</p>
<p>立刻关闭线程池，调用stutdownNow之后，正在执行的线程会收到<strong>interrupted</strong>中断信号，还没有执行的线程会直接结束并且返回成<code v-pre>List&lt;Runnable&gt;</code>，以便于后续继续执行</p>
</li>
</ul>
<h2 id="_3-拒绝策略" tabindex="-1"><a class="header-anchor" href="#_3-拒绝策略" aria-hidden="true">#</a> 3. 拒绝策略</h2>
<h4 id="拒绝时机" tabindex="-1"><a class="header-anchor" href="#拒绝时机" aria-hidden="true">#</a> 拒绝时机</h4>
<ul>
<li>当Executor调用shutdown后，新提交的任务会直接拒绝</li>
<li>当Executor对最大线程和工作队列容量使用是有界队列，并且饱和时会拒绝</li>
</ul>
<h4 id="拒绝策略" tabindex="-1"><a class="header-anchor" href="#拒绝策略" aria-hidden="true">#</a> 拒绝策略</h4>
<ul>
<li>
<p>AbortPolicy</p>
<p>默认的拒绝策略，即丢弃任务并抛出RejectedExecutionException异常</p>
<p>如果是比较关键的业务，推荐使用此拒绝策略，这样子在系统不能承载更大的并发量的时候，能够及时的通过异常发现。</p>
</li>
<li>
<p>DiscardPolicy</p>
<p>ThreadPoolExecutor.DiscardPolicy：丢弃任务，但是不抛出异常。如果线程队列已满，则后续提交的任务都会被丢弃，且是静默丢弃。</p>
<p>使用此策略，可能会使我们无法发现系统的异常状态。建议是一些无关紧要的业务采用此策略。例如，本人的博客网站统计阅读量就是采用的这种拒绝策略。</p>
</li>
<li>
<p>DiscardOldestPolicy</p>
<p>ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新提交被拒绝的任务。</p>
<p>此拒绝策略，是一种喜新厌旧的拒绝策略。是否要采用此种拒绝策略，还得根据实际业务是否允许丢弃老任务来认真衡量。</p>
</li>
<li>
<p>CallerRunsPolicy</p>
<p>ThreadPoolExecutor.CallerRunsPolicy：由调用线程执行该任务。拒绝了，让调用方线程来执行任务，并且可以让提交任务速度降低</p>
</li>
</ul>
<h2 id="_4-钩子方法" tabindex="-1"><a class="header-anchor" href="#_4-钩子方法" aria-hidden="true">#</a> 4. 钩子方法</h2>
<p>​		beforExecute钩子方法</p>
<p>​</p>
<h2 id="_5-实现原理、源码分析" tabindex="-1"><a class="header-anchor" href="#_5-实现原理、源码分析" aria-hidden="true">#</a> 5. 实现原理、源码分析</h2>
<h4 id="线程池组成部分" tabindex="-1"><a class="header-anchor" href="#线程池组成部分" aria-hidden="true">#</a> 线程池组成部分</h4>
<ul>
<li>线程池管理器</li>
<li>工作线程</li>
<li>任务队列</li>
<li>任务接口（Task）</li>
</ul>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201038480.png" alt="image-20211019160007789-16346332568392"></p>
<h4 id="线程池实现任务复用的原理" tabindex="-1"><a class="header-anchor" href="#线程池实现任务复用的原理" aria-hidden="true">#</a> 线程池实现任务复用的原理</h4>
<p>相同线程执行不同的任务，不是通过start来启动任务的。</p>
<p><strong>查看execute方法：</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">execute</span><span class="token punctuation">(</span><span class="token class-name">Runnable</span> command<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>command <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NullPointerException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">/*
         * Proceed in 3 steps:
         *
         * 1. If fewer than corePoolSize threads are running, try to
         * start a new thread with the given command as its first
         * task.  The call to addWorker atomically checks runState and
         * workerCount, and so prevents false alarms that would add
         * threads when it shouldn't, by returning false.
         *
         * 2. If a task can be successfully queued, then we still need
         * to double-check whether we should have added a thread
         * (because existing ones died since last checking) or that
         * the pool shut down since entry into this method. So we
         * recheck state and if necessary roll back the enqueuing if
         * stopped, or start a new thread if there are none.
         *
         * 3. If we cannot queue task, then we try to add a new
         * thread.  If it fails, we know we are shut down or saturated
         * and so reject the task.
         */</span>
        <span class="token keyword">int</span> c <span class="token operator">=</span> ctl<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">workerCountOf</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span> <span class="token operator">&lt;</span> corePoolSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        	<span class="token comment">// 添加到工作队列中</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">addWorker</span><span class="token punctuation">(</span>command<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span><span class="token punctuation">;</span>
            c <span class="token operator">=</span> ctl<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isRunning</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> workQueue<span class="token punctuation">.</span><span class="token function">offer</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> recheck <span class="token operator">=</span> ctl<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span> <span class="token function">isRunning</span><span class="token punctuation">(</span>recheck<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token function">remove</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token function">reject</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">workerCountOf</span><span class="token punctuation">(</span>recheck<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
                <span class="token function">addWorker</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">addWorker</span><span class="token punctuation">(</span>command<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token function">reject</span><span class="token punctuation">(</span>command<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201039594.png" alt="image-20211019161103327-16346332651513"></p>
<p>创建了一个Worker的类，并且将任务提交了过去</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201039842.png" alt="image-20211019161201917-16346332709074"></p>
<p>由于将this传递过去，那么将会执行本类中的run方法</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201039033.png" alt="image-20211019161304476-16346332766825"></p>
<p>继续执行runWorker方法</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201039372.png" alt="image-20211019161352537-16346332807846"></p>
<h2 id="_6-使用线程池的注意点" tabindex="-1"><a class="header-anchor" href="#_6-使用线程池的注意点" aria-hidden="true">#</a> 6. 使用线程池的注意点</h2>
<h4 id="线程池状态" tabindex="-1"><a class="header-anchor" href="#线程池状态" aria-hidden="true">#</a> 线程池状态</h4>
<p><strong>RUNNING</strong>：能接受新提交的任务，并且也能处理阻塞队列中的任务；</p>
<p><strong>SHUTDOWN</strong>：关闭状态，不再接受新提交的任务，但却可以继续处理阻塞队列中已保存的任务。</p>
<p><strong>STOP</strong>：不能接受新任务，也不处理队列中的任务，会中断正在处理任务的线程。在线程池处于 <code v-pre>RUNNING</code> 或 <code v-pre>SHUTDOWN</code> 状态时，调用<code v-pre>shutdownNow()</code> 方法会使线程池进入到该状态；</p>
<p><strong>TIDYING</strong>：如果所有的任务都已终止了，workerCount (有效线程数) 为0，线程池进入该状态后会调用 <code v-pre>terminated()</code> 方法进入<code v-pre>TERMINATED</code> 状态。</p>
<p><strong>TERMINATED</strong>：在<code v-pre>terminated()</code>方法执行完后进入该状态</p>
<p>各个状态之间的切换示意图：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201045574.png" alt="image-20211019161518767-16346332897627"></p>
<p><strong>Thread状态：</strong></p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20220214142600802.png" alt="image-20220214142600802"></p>
<h4 id="注意事项" tabindex="-1"><a class="header-anchor" href="#注意事项" aria-hidden="true">#</a> 注意事项</h4>
<p>线程池使用FutureTask的时候如果拒绝策略设置为了 DiscardPolicy和DiscardOldestPolicy并且在被拒绝的任务的Future对象上调用无参get方法那么调用线程会一直被阻塞。</p>
<h2 id="_7-最佳实践" tabindex="-1"><a class="header-anchor" href="#_7-最佳实践" aria-hidden="true">#</a> 7.  最佳实践</h2>
<ul>
<li>不使用系统自带的四个Executors</li>
<li>设置<code v-pre>UncaughtExceptionHandler</code></li>
<li>优雅的关闭线程池</li>
</ul>
<h1 id="_2-threadlocal" tabindex="-1"><a class="header-anchor" href="#_2-threadlocal" aria-hidden="true">#</a> 2. ThreadLocal</h1>
<h2 id="_2-1-threadlocal使用场景" tabindex="-1"><a class="header-anchor" href="#_2-1-threadlocal使用场景" aria-hidden="true">#</a> 2.1 ThreadLocal使用场景</h2>
<ul>
<li>
<p>每个线程独享： 通常是工具类（线程不安全），典型的是SimpleDateFormat和Random</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
<li>
<p>每个线程需要保存全局变量： 如在接口调用中，拦截器处理用户信息，后面的每个方法都可以获取到用户信息,避免参数多次传递麻烦</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> threadLocal <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
threadLocal<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">"ddd"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
threadLocal<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p><strong>总结：</strong></p>
<ol>
<li>上某个需要用到的对象在线程间隔离（每个线程都有自己独立的对象）</li>
<li>在任何方法中都可以轻松的获取到对象</li>
</ol>
<p><strong>好处</strong></p>
<ul>
<li>达到线程安全</li>
<li>避免传参的繁琐： ThreadLocal使得代码耦合度更低，代码更优雅</li>
<li>不需要加锁，执行效率高</li>
<li>更高效的利用内存、节省开销： 避免重复创建对象</li>
</ul>
<h2 id="_2-2-源码" tabindex="-1"><a class="header-anchor" href="#_2-2-源码" aria-hidden="true">#</a> 2.2 源码</h2>
<p>搞清楚Thread、ThreadLocal、ThreadLocalMap三者的关系</p>
<p>每个Thread对象都持有一个ThreadLocalMap成员变量</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201354141.png" alt="image-20211020135447028"></p>
<p>原理图：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201358358.png" alt="image-20211020135858268"></p>
<p><strong>说明</strong>： Thread中存在一个ThreadLocalMap变量，ThreadLocalMap存在多个ThreadLocal，ThreadLocalMap下存在一个Entry[] table数组，用于存储ThreadLocal</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>   <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Entry</span> <span class="token keyword">extends</span> <span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ThreadLocal</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span><span class="token punctuation">></span></span> <span class="token punctuation">{</span>
            <span class="token doc-comment comment">/** The value associated with this ThreadLocal. */</span>
            <span class="token class-name">Object</span> value<span class="token punctuation">;</span>

            <span class="token class-name">Entry</span><span class="token punctuation">(</span><span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> k<span class="token punctuation">,</span> <span class="token class-name">Object</span> v<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">super</span><span class="token punctuation">(</span>k<span class="token punctuation">)</span><span class="token punctuation">;</span>
                value <span class="token operator">=</span> v<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Entry[] 数组，存储ThreadLocal数据</p>
<p><strong>注意：Entry类继承了WeakReference弱引用</strong></p>
<ul>
<li>
<p>StrongReference: 强引用，new出来对象，只要引用存在，虚拟机就不会回收，直到报OOM</p>
</li>
<li>
<p>SoftReference： 软引用，软引用是用来描述一些非必需但仍有用的对象。在内存足够的时候，软引用对象不会被回收，只有在内存不足时，系统则会回收软引用对象，如果回收了软引用对象之后仍然没有足够的内存，才会抛出内存溢出异常。这种特性常常被用来实现缓存技术，比如网页缓存，图片</p>
<p>缓存等</p>
</li>
<li>
<p>WeakReference: 弱引用 ，无论内存是否足够，只要 JVM 开始进行垃圾回收，那些被弱引用关联的对象都会被回收</p>
</li>
<li>
<p>PhantomReference: 虚引用 ，无法使用，基本就是在JVM回收时，能有个通知</p>
</li>
</ul>
<h2 id="_2-3-重要方法" tabindex="-1"><a class="header-anchor" href="#_2-3-重要方法" aria-hidden="true">#</a> 2.3 重要方法</h2>
<ul>
<li>
<p>initalvalue() 初始化</p>
<p>通常调用1次，remove()，还会在初始化</p>
<p>不覆盖，会直接返回null</p>
</li>
<li>
<p>get() 获取值</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Returns the value in the current thread's copy of this
 * thread-local variable.  If the variable has no value for the
 * current thread, it is first initialized to the value returned
 * by an invocation of the <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token punctuation">#</span><span class="token field">initialValue</span></span><span class="token punctuation">}</span> method.
 *
 * <span class="token keyword">@return</span> the current thread's value of this thread-local
 */</span>
<span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// 获取当前线程</span>
    <span class="token class-name">Thread</span> t <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 获取当前得到的线程中的ThreadLocamMap， return t.threadLocals;</span>
    <span class="token class-name">ThreadLocalMap</span> map <span class="token operator">=</span> <span class="token function">getMap</span><span class="token punctuation">(</span>t<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>map <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    	<span class="token comment">// 得到map中的对象，需要传递当前ThreadLocal对象</span>
        <span class="token class-name">ThreadLocalMap<span class="token punctuation">.</span>Entry</span> e <span class="token operator">=</span> map<span class="token punctuation">.</span><span class="token function">getEntry</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>e <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">"unchecked"</span><span class="token punctuation">)</span>
            <span class="token class-name">T</span> result <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">T</span><span class="token punctuation">)</span>e<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
            <span class="token keyword">return</span> result<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// get之前没有进行set，那么需要进行初始化</span>
    <span class="token keyword">return</span> <span class="token function">setInitialValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>获取Entry对象</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Get the entry associated with key.  This method
 * itself handles only the fast path: a direct hit of existing
 * key. It otherwise relays to getEntryAfterMiss.  This is
 * designed to maximize performance for direct hits, in part
 * by making this method readily inlinable.
 *
 * <span class="token keyword">@param</span>  <span class="token parameter">key</span> the thread local object
 * <span class="token keyword">@return</span> the entry associated with key, or null if no such
 */</span>
<span class="token keyword">private</span> <span class="token class-name">Entry</span> <span class="token function">getEntry</span><span class="token punctuation">(</span><span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 得到hash值</span>
    <span class="token keyword">int</span> i <span class="token operator">=</span> key<span class="token punctuation">.</span>threadLocalHashCode <span class="token operator">&amp;</span> <span class="token punctuation">(</span>table<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 从Entry类中的table数组中获取到当前的Entry值，也就是我们ThreadLcoal存储的值</span>
    <span class="token class-name">Entry</span> e <span class="token operator">=</span> table<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>e <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> e<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> key<span class="token punctuation">)</span>
        <span class="token keyword">return</span> e<span class="token punctuation">;</span>
    <span class="token keyword">else</span>
        <span class="token keyword">return</span> <span class="token function">getEntryAfterMiss</span><span class="token punctuation">(</span>key<span class="token punctuation">,</span> i<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>set() 设置值</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">T</span> value<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Thread</span> t <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">ThreadLocalMap</span> map <span class="token operator">=</span> <span class="token function">getMap</span><span class="token punctuation">(</span>t<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>map <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
        map<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">else</span>
        <span class="token function">createMap</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> value<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>remove 删除当前线程的ThreadLocal</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ThreadLocalMap</span> m <span class="token operator">=</span> <span class="token function">getMap</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>m <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
    	<span class="token comment">// 删除的是调用者ThreadLocal</span>
        m<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<p><strong>ThreadLocalMap类</strong></p>
<p>类似于HashMap,都维护了一个数组，但是注意解决hash冲突的方式不一样</p>
<p>HashMap： 拉链法+红黑树</p>
<p>ThreadLocalMap: 线性探测法</p>
<p>​		所谓线性探测，就是根据初始 key 的 hashcode 值确定元素在 table 数组中的位置，如果发现这个位置上已经被其他的 key 值占用，则利用固定的算法寻找一定步长的下个位置，依次判断，直至找到能够存放的位置。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token comment">// 计算hash值</span>
<span class="token keyword">int</span> h <span class="token operator">=</span> key<span class="token punctuation">.</span>threadLocalHashCode <span class="token operator">&amp;</span> <span class="token punctuation">(</span>len <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// 判断如果该位置已经有值</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>table<span class="token punctuation">[</span>h<span class="token punctuation">]</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
	<span class="token comment">// 进行继续添查找下一个数据为空的位置</span>
	h <span class="token operator">=</span> <span class="token function">nextIndex</span><span class="token punctuation">(</span>h<span class="token punctuation">,</span> len<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
   
<span class="token doc-comment comment">/**
* Increment i modulo len.
*/</span>
<span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">int</span> <span class="token function">nextIndex</span><span class="token punctuation">(</span><span class="token keyword">int</span> i<span class="token punctuation">,</span> <span class="token keyword">int</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token operator">?</span> i <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-4-内存泄漏" tabindex="-1"><a class="header-anchor" href="#_2-4-内存泄漏" aria-hidden="true">#</a> 2.4 内存泄漏</h2>
<p>ThreadLocalMap中的成员变量是一个Entry[] table</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Entry</span> <span class="token keyword">extends</span> <span class="token class-name">WeakReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ThreadLocal</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span><span class="token punctuation">></span></span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/** The value associated with this ThreadLocal. */</span>
    <span class="token class-name">Object</span> value<span class="token punctuation">;</span>

    <span class="token class-name">Entry</span><span class="token punctuation">(</span><span class="token class-name">ThreadLocal</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> k<span class="token punctuation">,</span> <span class="token class-name">Object</span> v<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">super</span><span class="token punctuation">(</span>k<span class="token punctuation">)</span><span class="token punctuation">;</span>
        value <span class="token operator">=</span> v<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意观察到Entry继承WeakReference，WeakReferece是一个弱引用，弱引用可以被jvm垃圾回收直接回收。</p>
<p><strong>Java引用类型</strong></p>
<ul>
<li>
<p>强引用： new Object()</p>
</li>
<li>
<p>软引用： 软引用是用来描述一些非必需但仍有用的对象。<strong>在内存足够的时候，软引用对象不会被回收，只有在内存不足时，系统则会回收软引用对象，如果回收了软引用对象之后仍然没有足够的内存，才会抛出内存溢出异常</strong>。</p>
</li>
<li>
<p>弱引用： 弱引用的引用强度比软引用要更弱一些，<strong>无论内存是否足够，只要 JVM 开始进行垃圾回收，那些被弱引用关联的对象都会被回收</strong>。在 JDK1.2 之后，用 java.lang.ref.WeakReference 来表示弱引用</p>
</li>
<li>
<p>虚引用：虚引用是最弱的一种引用关系，如果一个对象仅持有虚引用，那么它就和没有任何引用一样，它随时可能会被回收，在 JDK1.2 之后，用 PhantomReference 类来表示，通过查看这个类的源码，发现它只有一个构造函数和一个 get() 方法，而且它的 get() 方法仅仅是返回一个null，也就是说将永远无法通过虚引用来获取对象，虚引用必须要和 ReferenceQueue 引用队列一起使用。主要用来做被回收后得到通知。</p>
</li>
</ul>
<p>JDK已经考虑到了这个问题，所以在set、remove、rehash方法中会扫描key为null的Entry，并把对应的value设置为null，这样value对象就会被回收。</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201425702.png" alt="image-20211020142524583"></p>
<p>但是还是会存在问题，因为可能在开发中不会去调到这些方法。所以阿里的开发规范中，<strong>要求我们使用完毕之后手动的进行threadLocal.remove()方法进行回收。</strong></p>
<p><strong>注意</strong>：</p>
<p>实际开发中： 用拦截器的方式设置ThreadLocal，那么也应该在拦截器中对该ThreadLocal进行remove()</p>
<p>注意基本类型的装箱拆箱问题</p>
<p>不应该在ThreadLocal存储static静态对象</p>
<h1 id="_3-锁" tabindex="-1"><a class="header-anchor" href="#_3-锁" aria-hidden="true">#</a> 3. 锁</h1>
<h2 id="_3-1-lock接口" tabindex="-1"><a class="header-anchor" href="#_3-1-lock接口" aria-hidden="true">#</a> 3.1 Lock接口</h2>
<p>​	为什么synchronized不够用？</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>1. 效率低： 锁释放情况少（执行完毕，出异常），试图获取锁时不能设定超时、不能中断一个正在试图获取锁的线程
2. 不够灵活（读写锁更灵活）： 加锁和释放的时机单一，每个锁仅有一个单一条件（某个对象）
3. 无法知道是否成功获取到锁
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于synchronized的问题，那么lock锁就来了。</p>
<p><strong>重点有四个方法：</strong></p>
<p>​	lock(): 普通的获取锁，无法得到时就等待,<strong>lock出异常不会自动释放锁</strong>，<strong>lock方法不能被中断</strong>，一旦陷入死锁，lock就会被陷入永久等待</p>
<p>​	tryLock() 尝试获取锁，获取不到就立即返回false</p>
<p>​	tryLock(long time,TimeUnit unit) 尝试获取锁，但是在规定时间内无法获取锁，那么也直接返回false</p>
<p>​	lockInterruptibly() 等待锁的时间默认设置为无限，但是是可以被响应中断</p>
<p>​	unlock() 解锁，需要写在finally中，保证都能释放锁</p>
<p><strong>lock锁是具有可见性保障的</strong></p>
<p>可见性： a线程修改了会同时反映到其他线程，保证其他线程可见</p>
<h2 id="_3-2-锁的分类" tabindex="-1"><a class="header-anchor" href="#_3-2-锁的分类" aria-hidden="true">#</a> 3.2 锁的分类</h2>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110201529795.png" alt="image-20211020152942630"></p>
<p>互斥同步锁的劣势：</p>
<ul>
<li>阻塞和唤醒带来的性能劣势</li>
<li>永久阻塞： 如果持有锁的线程被永久阻塞，比如入到了无限循环、死锁等活跃性问题，那么等待该线程释放锁的那几个悲催的线程，将永远也得不到执行</li>
<li>优先级反转</li>
</ul>
<h2 id="_3-3-乐观锁和悲观锁" tabindex="-1"><a class="header-anchor" href="#_3-3-乐观锁和悲观锁" aria-hidden="true">#</a> 3.3 乐观锁和悲观锁</h2>
<p>​	悲观锁：默认其他线程会来抢锁，所以对资源都直接加锁</p>
<p>​	乐观锁： 某人其他线程不会抢夺锁，在修改的时候在检查是否被别的线程修改，一般是利用CAS实现的；一般<strong>原子类，并发容器类,Git版本管理</strong>。AtomicInteger等</p>
<p><strong>开销对比：</strong></p>
<p>​	悲观锁的原始开销要高于乐观锁，但是特点是<strong>一劳永逸</strong>，临界区持锁的时间就算越来越差，也不会对互斥锁的开销造成印象</p>
<p>​	乐观锁如果自旋时间很长或者不断重试，那么消耗的资源会越来越多</p>
<p><strong>使用场景</strong></p>
<p>​	悲观锁： 适合并发写入多的情况，适用于临界区持锁时间比较长的情况，悲观锁可以避免大量的无用自旋消耗：</p>
<ul>
<li>
<p>临界区有IO操作</p>
</li>
<li>
<p>临界区代码复杂或者循环量大</p>
</li>
<li>
<p>临界区竞争激烈</p>
<p>乐观锁：</p>
<p>​	适合并发<strong>写入少，大部分是读取</strong>的场景，不加锁的读取性能大幅度提高</p>
</li>
</ul>
<h2 id="_3-4-可重入锁和非可重入锁-以reentrantlock" tabindex="-1"><a class="header-anchor" href="#_3-4-可重入锁和非可重入锁-以reentrantlock" aria-hidden="true">#</a> 3.4 可重入锁和非可重入锁，以ReentrantLock</h2>
<p>​	可重入锁： 可以多次获取到同一把锁（ReentrantLock,synchronized）</p>
<p>​	好处： 避免死锁，提高封装性</p>
<p>​	isHeldByCurrentThread可以看出锁是否被当前线程持有</p>
<p>​	getQueueLength可以返回当前正在等待这把锁的队列有多长</p>
<p>ReentrantLock实现：AQS,CAS</p>
<h2 id="_3-5-公平锁和非公平锁" tabindex="-1"><a class="header-anchor" href="#_3-5-公平锁和非公平锁" aria-hidden="true">#</a> 3.5 公平锁和非公平锁</h2>
<p>公平是指按照线程请求的顺序来分配锁；非公平是指：不完全按照请求的顺序，在一定情况下，可以插队。</p>
<p><strong>注意</strong>：非公平也同样不提倡“插队”行为，这里的非公平，指的是在<strong>合适的时机</strong>插队，而不是盲目的插队</p>
<p>非公平目的是为了提高效率，避免唤醒带来的空档期</p>
<p><strong>ReentrantLock默认是非公平的，可以通过构造函数指定为公平</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Random</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">Lock</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">ReentrantLock</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-20
 * 演示公平锁和非公平锁
 * 实例解释：
 *  默认非公平锁： 那么第一次打印之后，会立即打印第二次，并且打印完毕
 *  公平锁： 第一次打印，然后打印第二个线程第一次，第三个线程第一次.....,第二次打印，打印完毕，第二个线程打印，打印完毕....
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">FairLock</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">PrintQueue</span> queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PrintQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span><span class="token punctuation">[</span><span class="token punctuation">]</span> threads <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">[</span><span class="token number">10</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            threads<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Job</span><span class="token punctuation">(</span>queue<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> threads<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span> thread <span class="token operator">=</span> threads<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            thread<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Job</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token class-name">PrintQueue</span> printQueue<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Job</span><span class="token punctuation">(</span><span class="token class-name">PrintQueue</span> printQueue<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>printQueue <span class="token operator">=</span> printQueue<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"开始打印"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            printQueue<span class="token punctuation">.</span><span class="token function">printObj</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"打印完毕"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">PrintQueue</span> <span class="token punctuation">{</span>
        <span class="token comment">// 构造函数传递参数： 默认非公平，true=公平锁，false=非公平</span>
        <span class="token keyword">private</span> <span class="token class-name">Lock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">printObj</span><span class="token punctuation">(</span><span class="token class-name">Object</span> document<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token keyword">int</span> duration <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 第一次：正在打印,需要"</span> <span class="token operator">+</span> duration <span class="token operator">+</span> <span class="token string">"秒"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span>duration <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token keyword">int</span> duration <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 第二次：正在打印,需要"</span> <span class="token operator">+</span> duration <span class="token operator">+</span> <span class="token string">"秒"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span>duration <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印结果： 非公平</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Thread-0开始打印
Thread-0 第一次：正在打印,需要1秒
Thread-1开始打印
Thread-2开始打印
Thread-0 第二次：正在打印,需要3秒
Thread-0打印完毕
Thread-1 第一次：正在打印,需要0秒
Thread-1 第二次：正在打印,需要4秒
Thread-1打印完毕
Thread-2 第一次：正在打印,需要0秒
Thread-2 第二次：正在打印,需要4秒
Thread-2打印完毕

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>打印结果： 公平</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>Thread-0开始打印
Thread-0 第一次：正在打印,需要2秒
Thread-1开始打印
Thread-2开始打印
Thread-1 第一次：正在打印,需要0秒
Thread-2 第一次：正在打印,需要0秒
Thread-0 第二次：正在打印,需要0秒
Thread-0打印完毕
Thread-1 第二次：正在打印,需要0秒
Thread-1打印完毕
Thread-2 第二次：正在打印,需要2秒
Thread-2打印完毕
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>特例</strong></p>
<p>针对tryLock方法，它是不遵守设定的公平规则的</p>
<p>​	当有线程执行tryLock()的时候，一旦有线程释放了锁，那么正在tryLock的线程就能立即获取到锁，即使它之前已经有其他线程在等待队列中了</p>
<p><strong>优缺点：</strong></p>
<table>
<thead>
<tr>
<th></th>
<th>优势</th>
<th>劣势</th>
</tr>
</thead>
<tbody>
<tr>
<td>公平锁</td>
<td>每个公平平等，每个线程在等待一段时间之后，总会有执行的机会</td>
<td>更慢，吞吐量小</td>
</tr>
<tr>
<td>非公平锁</td>
<td>更快，吞吐量大</td>
<td>有可能产生线程饥饿，也就是某些线程长时间得不到执行</td>
</tr>
</tbody>
</table>
<p>公平锁原理图：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110202037968.png" alt=""></p>
<h2 id="_3-6-共享锁和排他锁-以reentrantreadwritelock读写锁" tabindex="-1"><a class="header-anchor" href="#_3-6-共享锁和排他锁-以reentrantreadwritelock读写锁" aria-hidden="true">#</a> 3.6 共享锁和排他锁： 以ReentrantReadWriteLock读写锁</h2>
<p>​	排它锁： 又称独占锁，独享锁</p>
<p>​	共享锁： 有称为读锁，获取共享锁之后，可以查看但是无法修改和删除数据，其他线程也可以获取到共享锁，也是查看但是无法修改和删除数据</p>
<p>​	共享锁和排它锁的典型是读写锁<strong>ReentrantReadWriteLock</strong>,其中读锁是共享锁，写锁是排它锁</p>
<p><strong>读写锁的规则</strong></p>
<ol>
<li>多个线程值申请读锁，都可以申请到</li>
<li>如果有一个线程占用了读锁，其他线程要申请写锁，就必须等待读锁释放</li>
<li>如果有一个线程占用了写锁，其他线程想要申请读写锁，都必须等待</li>
</ol>
<p><strong>结论： 要么一个或多个线程同时有读锁，要么一个线程有写锁；（要么多读，要么一写，两者不可能同时出现）</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">ReentrantReadWriteLock</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-20
 * 读写锁
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReentrantReadWriteLockDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ReentrantReadWriteLock</span> reentrantReadWriteLock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantReadWriteLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 读写锁</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ReentrantReadWriteLock<span class="token punctuation">.</span>ReadLock</span> readLock <span class="token operator">=</span> reentrantReadWriteLock<span class="token punctuation">.</span><span class="token function">readLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">ReentrantReadWriteLock<span class="token punctuation">.</span>WriteLock</span> writeLock <span class="token operator">=</span> reentrantReadWriteLock<span class="token punctuation">.</span><span class="token function">writeLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">read</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        readLock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"得到了读锁，正在读取中"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            readLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"释放了读锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">write</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        writeLock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"得到写锁，正在写入"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            writeLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"释放了写锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token function">read</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"Thread1"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token function">read</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"Thread2"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token function">write</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"Thread3"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token function">write</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"Thread4"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​	允许插队的情况： 容易引起饥饿，但是效率较高</p>
<p>​		大量线程在读，有个线程在队列中想要获取写锁，但是读锁未释放的情况下，其他读线程一直在插队读取，造成了写线程一直无法执行</p>
<p>​	不允许插队： 避免饥饿，直接进入排队</p>
<p>​	<strong>ReentrantReadWriteLock</strong></p>
<p>​	公平情况下：不允许插队</p>
<p>​	非公平情况下： 分为两种情况，</p>
<ul>
<li>写锁可以随时插队</li>
<li>读锁仅在等待队列头结点不是写锁的时候可以插队</li>
</ul>
<p><strong>源码</strong></p>
<p>公平锁情况：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110202104048.png" alt="image-20211020210355129"></p>
<p>​		非公平锁情况：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110202106810.png" alt="image-20211020210613573"></p>
<p><strong>升降级</strong>： 支持锁的降级，不支持升级，从写锁降级到读锁</p>
<p><strong>总结</strong>：</p>
<pre><code>1. 获取锁策略： 要么多读，要么一写
2. 插队策略： 为了防止饥饿，读锁不能插队；公平锁：全部不能插队，非公平锁： 写锁可以插队，读锁需要在排队队列头结点是读锁才能插队，否则不能插队。
3. 升降级策略： 只能降级，不能升级
</code></pre>
<p>使用场景： 适用于读多写少的场景</p>
<h2 id="_3-7-自旋锁和阻塞锁" tabindex="-1"><a class="header-anchor" href="#_3-7-自旋锁和阻塞锁" aria-hidden="true">#</a> 3.7 自旋锁和阻塞锁</h2>
<p>优点： 避免上下文切换</p>
<p>缺点： 长时间占有CPU资源，造成资源浪费</p>
<p>原子类中很多都是自旋锁</p>
<p>原理： 就是利用CAS</p>
<p>使用场景： 用于多核服务器，在并发度不高的情况下，比阻塞锁效率高；适用于在临界区比较短小的情况，否则如果临界区很大（线程一旦获取锁，很长时间才释放），那么也不合适。</p>
<h2 id="_3-8-可中断锁-就是可以响应中断的锁" tabindex="-1"><a class="header-anchor" href="#_3-8-可中断锁-就是可以响应中断的锁" aria-hidden="true">#</a> 3.8 可中断锁： 就是可以响应中断的锁</h2>
<p>synchronized： 不可中断锁</p>
<p>ReentrantLock： 可中断锁</p>
<h2 id="_3-9-锁优化" tabindex="-1"><a class="header-anchor" href="#_3-9-锁优化" aria-hidden="true">#</a> 3.9 锁优化</h2>
<p>JVM优化：</p>
<pre><code>- 自旋锁和自适应
- 锁消除
- 锁粗化
</code></pre>
<p><strong>如何在写代码中优化锁和提高性能</strong></p>
<ol>
<li>缩小同步代码块</li>
<li>尽量不要锁住方法</li>
<li>减少锁的次数</li>
<li>避免人为制造<strong>热点</strong></li>
<li>锁中不要再包含锁</li>
<li>选择适合的锁的类型或者合适的工具类</li>
</ol>
<h1 id="_4-atomic包" tabindex="-1"><a class="header-anchor" href="#_4-atomic包" aria-hidden="true">#</a> 4.  atomic包</h1>
<h2 id="_4-1-什么是原子类-有什么作用" tabindex="-1"><a class="header-anchor" href="#_4-1-什么是原子类-有什么作用" aria-hidden="true">#</a> 4.1 什么是原子类，有什么作用？</h2>
<p>​	一个操作是<strong>不可中断</strong>的，即使在多线程下也可以保证</p>
<p>​	原子的粒度更细： 原子变量可以把竞争范围缩小到变量级别，这是我们可以获得的最细粒度的情况，通常锁的粒度要大于原子变量的粒度</p>
<p>​	效率更高： 通常，使用原子类的效率会比使用锁的效率更高，但是在高度竞争的情况下会出现以外，因为原子类<strong>利用CAS</strong>，不断的自旋导致的。</p>
<p>​	主要在：**java.util.concurrent.atomic.**包中</p>
<h2 id="_4-2-6类原子类" tabindex="-1"><a class="header-anchor" href="#_4-2-6类原子类" aria-hidden="true">#</a> 4.2 6类原子类</h2>
<table>
<thead>
<tr>
<th>原子类型</th>
<th>具体类型</th>
</tr>
</thead>
<tbody>
<tr>
<td>Atomic*基本类型原子类</td>
<td>AtomicInteger、AtomicLong、AtomicBoolean</td>
</tr>
<tr>
<td>Atomicc*Array数组类型原子类</td>
<td>AtomicIntegerArray、AtomicLongArray、AtomicReferenceArray</td>
</tr>
<tr>
<td>Atomic*Reference引用类型原子类</td>
<td>AtomicReference、AtomicStampedReference、AtomicMarkableReference</td>
</tr>
<tr>
<td>Atomic*FieldUpdater升级类型原子类</td>
<td>AtomicIntegerFieldUpdater、AtomicLongFieldUpdater、AtomicReferenceFieldUpdater</td>
</tr>
<tr>
<td>Adder累加器</td>
<td>LongAdder、DoubleAdder</td>
</tr>
</tbody>
</table>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110211007551.png" alt="image-20211021100700437"></p>
<h2 id="_4-3-atiomic-基本类型原子类" tabindex="-1"><a class="header-anchor" href="#_4-3-atiomic-基本类型原子类" aria-hidden="true">#</a> 4.3 Atiomic*基本类型原子类</h2>
<p><strong>AtomicInteger原子类</strong></p>
<p>常用方法：</p>
<ul>
<li>
<p>public final int get() // 获取当前值</p>
</li>
<li>
<p>public final int getAndSet(int newValue) // 获取当前的值，并设置新的值</p>
</li>
<li>
<p>public final int getAndIncrement() // 获取当前值，并自增</p>
</li>
<li>
<p>public final int getAndDecrement() // 获取当前值，并自减</p>
</li>
<li>
<p>public final int getAndAdd(int delta) // 获取当前的值，并加上预期值</p>
</li>
<li>
<p>bool compareAndSet(int expect,int update)// 如果输入的值等于预期值，则以原子方式将该值设置为输入的值（update)</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">AtomicInteger</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 演示AtomicInteger基本用法，对比非原子类的线程安全问题，使用了原子类之后，不需要枷锁，也可以保证
 * 线程安全
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AtomicIntegerDemo1</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">AtomicInteger</span> atomicInteger <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicInteger</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">incrementAtomic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        atomicInteger<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span> basicCOunt <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">incrementBasic</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        basicCOunt<span class="token operator">++</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">incrementAtomic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token function">incrementBasic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">AtomicIntegerDemo1</span> atomicIntegerDemo1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicIntegerDemo1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>atomicIntegerDemo1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>atomicIntegerDemo1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"原子类："</span> <span class="token operator">+</span> atomicInteger<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"普通变量:"</span> <span class="token operator">+</span> basicCOunt<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>运行结果：</strong></p>
<p>原子类：20000
普通变量:17661</p>
</li>
</ul>
<h2 id="_4-4-atomic-array数组类原子类" tabindex="-1"><a class="header-anchor" href="#_4-4-atomic-array数组类原子类" aria-hidden="true">#</a> 4.4 Atomic*Array数组类原子类</h2>
<p><strong>AtomicIntegerArray</strong>就是基本原子类型的数组形态</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">AtomicIntegerArray</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 演示AtomicIntegerArray基本用法，对比非原子类的线程安全问题，使用了原子类之后，不需要枷锁，也可以保证
 * 线程安全
 * 大量的线程进行并发的添加，减少
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AtomicIntegerArrayDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">AtomicIntegerArray</span> atomicInteger <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicIntegerArray</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Decrementer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token class-name">AtomicIntegerArray</span> atomicInteger<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Decrementer</span><span class="token punctuation">(</span><span class="token class-name">AtomicIntegerArray</span> atomicInteger<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>atomicInteger <span class="token operator">=</span> atomicInteger<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> ai <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> ai <span class="token operator">&lt;</span> atomicInteger<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> ai<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                atomicInteger<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span>ai<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Incrementer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token class-name">AtomicIntegerArray</span> atomicInteger<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Incrementer</span><span class="token punctuation">(</span><span class="token class-name">AtomicIntegerArray</span> atomicInteger<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>atomicInteger <span class="token operator">=</span> atomicInteger<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> ai <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> ai <span class="token operator">&lt;</span> atomicInteger<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> ai<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                atomicInteger<span class="token punctuation">.</span><span class="token function">getAndDecrement</span><span class="token punctuation">(</span>ai<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> size <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span><span class="token punctuation">[</span><span class="token punctuation">]</span> threadIns <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span><span class="token punctuation">[</span><span class="token punctuation">]</span> threadDec <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">[</span>size<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            threadIns<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Incrementer</span><span class="token punctuation">(</span>atomicInteger<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            threadDec<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Decrementer</span><span class="token punctuation">(</span>atomicInteger<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            threadIns<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            threadDec<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            threadIns<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            threadDec<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> atomicInteger<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>atomicInteger<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发现错误：位置"</span> <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"程序运行结束"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>可以某个原子类型的操作</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110211033642.png" alt="image-20211021103337515"></p>
<h2 id="_4-5-atomic-reference引用类型原子类" tabindex="-1"><a class="header-anchor" href="#_4-5-atomic-reference引用类型原子类" aria-hidden="true">#</a> 4.5 Atomic*Reference引用类型原子类</h2>
<p>AtomicReference: AtomicReference类的作用，和AtomicInteger并没有本质区别，AtomicInteger可以让一个整数类型保证原子性，而AtomiceReference可以让一个<strong>对象</strong>保证原子性，当然，AtomicReference的功能明显比AtomicInteger更强，因为一个对象里可以<strong>包含很多属性</strong>,用法也和AtomicInteger类似。</p>
<p>模拟一个自旋锁实例</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 利用AtomicReference实现一个自旋锁
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AtomicReferenceDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">AtomicReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Thread</span><span class="token punctuation">></span></span> sign <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicReference</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span>sign<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> thread<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
<span class="token comment">//            System.out.println("自旋锁获取失败，继续尝试获取锁");</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 当前线程是我持有锁，那么就进行释放锁</span>
        sign<span class="token punctuation">.</span><span class="token function">compareAndSet</span><span class="token punctuation">(</span>thread<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">AtomicReferenceDemo</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicReferenceDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Runnable</span> runnable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 开始尝试获取自旋锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"获取自旋锁"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>runnable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>runnable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>输出：</p>
<p>Thread-1 开始尝试获取自旋锁
Thread-0 开始尝试获取自旋锁
Thread-1获取自旋锁</p>
<p>-----这里会大量输出自旋锁等待，继续尝试获取锁，CAS的原理体现</p>
<p>Thread-0获取自旋锁</p>
<h2 id="_4-6-把普通变量升级为原子类-用atomicintegerfiledupdater升级原有变量" tabindex="-1"><a class="header-anchor" href="#_4-6-把普通变量升级为原子类-用atomicintegerfiledupdater升级原有变量" aria-hidden="true">#</a> 4.6 把普通变量升级为原子类，用AtomicIntegerFiledUpdater升级原有变量</h2>
<p>使用场景： <strong>偶尔需要一个原子get-set操作</strong>，大多数情况下是普通类型，不需要原子操作</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">AtomicIntegerFieldUpdater</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 对普通变量进行升级
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AtomicIntegerFieldUpdateDemo</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>

    <span class="token keyword">static</span> <span class="token class-name">Candidate</span> tom<span class="token punctuation">;</span>
    <span class="token keyword">static</span> <span class="token class-name">Candidate</span> peter<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">AtomicIntegerFieldUpdater</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Candidate</span><span class="token punctuation">></span></span> scoreUpdate <span class="token operator">=</span> <span class="token class-name">AtomicIntegerFieldUpdater</span><span class="token punctuation">.</span><span class="token function">newUpdater</span><span class="token punctuation">(</span><span class="token class-name">Candidate</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token string">"score"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Candidate</span> <span class="token punctuation">{</span>
        <span class="token keyword">volatile</span> <span class="token keyword">int</span> score<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            peter<span class="token punctuation">.</span>score<span class="token operator">++</span><span class="token punctuation">;</span>
            scoreUpdate<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span>tom<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        tom <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Candidate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        peter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Candidate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">AtomicIntegerFieldUpdateDemo</span> d <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicIntegerFieldUpdateDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> t2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>d<span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"普通变量："</span> <span class="token operator">+</span> peter<span class="token punctuation">.</span>score<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"升级之后的："</span> <span class="token operator">+</span> tom<span class="token punctuation">.</span>score<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>结果：</p>
<pre><code>普通变量：19898
升级之后的：20000
</code></pre>
<p>**注意点： **</p>
<ul>
<li>可见范围：原理是用到了反射，所以必须是public的变量</li>
<li>不支持被static修饰的变量，加了static会报错</li>
</ul>
<h2 id="_4-7-adder累加器" tabindex="-1"><a class="header-anchor" href="#_4-7-adder累加器" aria-hidden="true">#</a> 4.7  Adder累加器</h2>
<p>jdk8引入，相对比较新</p>
<p>高并发下LongAddr比AtomicLong效率高，不过本质是空间换时间</p>
<p>竞争激烈的时候，LongAddr把不同线程对应到不同的Cell上进行修改，降低了冲突发生的概率，是<strong>多段锁</strong> 的概念，提高了并发性。</p>
<p><strong>AtomicInteger由于竞争很激烈，每一次加法，都要flush和refresh，导致耗费资源</strong></p>
<p>演示两种代码的编写:</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">AtomicLong</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 演示高并发场景下，LongAddr比AtomicLong性能好
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AtomicLongDemo</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> begin <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">AtomicLong</span> counter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">AtomicLong</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ExecutorService</span> service <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            service<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Task</span><span class="token punctuation">(</span>counter<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        service<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>service<span class="token punctuation">.</span><span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>counter<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Atomic耗时"</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> begin<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Task</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token class-name">AtomicLong</span> counter<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Task</span><span class="token punctuation">(</span><span class="token class-name">AtomicLong</span> counter<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>counter <span class="token operator">=</span> counter<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                counter<span class="token punctuation">.</span><span class="token function">incrementAndGet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>



<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">LongAdder</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 * 演示高并发场景下，LongAddr比AtomicLong性能好
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AddrLongDemo</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> begin <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">LongAdder</span> counter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LongAdder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ExecutorService</span> service <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            service<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Task</span><span class="token punctuation">(</span>counter<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        service<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">!</span>service<span class="token punctuation">.</span><span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>counter<span class="token punctuation">.</span><span class="token function">sum</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> end <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Adder耗时"</span> <span class="token operator">+</span> <span class="token punctuation">(</span>end <span class="token operator">-</span> begin<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Task</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token class-name">LongAdder</span> counter<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Task</span><span class="token punctuation">(</span><span class="token class-name">LongAdder</span> counter<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>counter <span class="token operator">=</span> counter<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10000</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                counter<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>**结果： **</p>
<p><strong>AtomicLong:</strong></p>
<p>100000000
Atomic耗时2025</p>
<p><strong>LongAdder:</strong></p>
<p>100000000
Adder耗时155</p>
<p>两种运行耗时是相差了量级的</p>
<p>原理：</p>
<p><strong>LongAdder的思路是把一个变量分解为多个变量，让同样多的线程去竞争多个资源</strong></p>
<p>LongAdder继承自Striped64，在Striped64中维护者三个变量：<strong>base、cellsBusy、Cell数组</strong>。base是个基础数据或初始数据，默认为0.cellsBusy用来实现自旋锁，状态值只有0和1，当创建Cell元素，扩容Cell数组或者初始化Cell数组时，使用CAS操作该变量来保证同时只有一个线程可以进行其中之一的操作。所以cells是volatile的，但没有加锁，而是用的自旋锁。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Table of cells. When non-null, size is a power of 2.
 */</span>
<span class="token keyword">transient</span> <span class="token keyword">volatile</span> <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> cells<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * Base value, used mainly when there is no contention, but also as
 * a fallback during table initialization races. Updated via CAS.
 */</span>
<span class="token keyword">transient</span> <span class="token keyword">volatile</span> <span class="token keyword">long</span> base<span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * Spinlock (locked via CAS) used when resizing and/or creating Cells.
  主要是实现自旋锁，只有0/1
 */</span>
<span class="token keyword">transient</span> <span class="token keyword">volatile</span> <span class="token keyword">int</span> cellsBusy<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每次调用increment时，都是调用add(1L)方法进行计算</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110212120432.png" alt="image-20211021211915298"></p>
<p>然后调用父类的longAccumulate方法。</p>
<p>使用LongAdder时，内部维护了多个Cell变量，每个Cell里面有一个初始值为0的long型变量，这样同时争取一个变量的线程就变少了，而是分散成对多个变量的竞争，减少了失败次数。如果竞争某个Cell变量失败，它不会一直在这个Cell变量上自旋CAS重试，而是尝试在其他的Cell变量上进行CAS尝试，这个改变增加了当前线程重试CAS成功的可能性。最后，在获取LongAdder当前值时，是把所有Cell变量的value值累加后再加上base返回的。</p>
<p>LongAdder里面有一个Cell数组，是惰性加载的，即需要时创建。当并发线程较少时，所有累加操作都是针对base变量进行。Cell类型是AtomicLong的一个改进，用来减少缓存的争用，也就是解决伪共享问题（多线程想要共享变量，都是借助于主存）。因为Cell数组元素的内存地址是连续的，所以数组内的多个元素能经常共享缓存行，因此这里使用@sun.misc.Contended注解对Cell类进行字节填充，防止数组中多个元素共享一个缓存行，提升性能</p>
<p><strong>最核心代码：</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">longAccumulate</span><span class="token punctuation">(</span><span class="token keyword">long</span> x<span class="token punctuation">,</span> <span class="token class-name">LongBinaryOperator</span> fn<span class="token punctuation">,</span>
                              <span class="token keyword">boolean</span> wasUncontended<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> h<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>h <span class="token operator">=</span> <span class="token function">getProbe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 第一次进入，hash为0，必须进行初始化</span>
            <span class="token class-name">ThreadLocalRandom</span><span class="token punctuation">.</span><span class="token function">current</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// force initialization</span>
            <span class="token comment">// 设置hash值为</span>
            h <span class="token operator">=</span> <span class="token function">getProbe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 设置未竞争标记为true</span>
            wasUncontended <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// </span>
        <span class="token keyword">boolean</span> collide <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>                <span class="token comment">// True if last slot nonempty</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> as<span class="token punctuation">;</span> <span class="token class-name">Cell</span> a<span class="token punctuation">;</span> <span class="token keyword">int</span> n<span class="token punctuation">;</span> <span class="token keyword">long</span> v<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>as <span class="token operator">=</span> cells<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>n <span class="token operator">=</span> as<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// cell为空或者数组非空，可以尝试累加</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>a <span class="token operator">=</span> as<span class="token punctuation">[</span><span class="token punctuation">(</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> h<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// </span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>cellsBusy <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>       <span class="token comment">// 尝试获取新的cell</span>
                        <span class="token class-name">Cell</span> r <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">// 创建一个新的插槽</span>
                        <span class="token keyword">if</span> <span class="token punctuation">(</span>cellsBusy <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> <span class="token function">casCellsBusy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 尝试获取锁</span>
                            <span class="token keyword">boolean</span> created <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                            <span class="token keyword">try</span> <span class="token punctuation">{</span>               <span class="token comment">// Recheck under lock</span>
                                <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> rs<span class="token punctuation">;</span> <span class="token keyword">int</span> m<span class="token punctuation">,</span> j<span class="token punctuation">;</span>
                                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>rs <span class="token operator">=</span> cells<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span>
                                    <span class="token punctuation">(</span>m <span class="token operator">=</span> rs<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span>
                                    rs<span class="token punctuation">[</span>j <span class="token operator">=</span> <span class="token punctuation">(</span>m <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> h<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                    rs<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> r<span class="token punctuation">;</span>
                                    created <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
                                <span class="token punctuation">}</span>
                            <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                                cellsBusy <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
                            <span class="token punctuation">}</span>
                            <span class="token keyword">if</span> <span class="token punctuation">(</span>created<span class="token punctuation">)</span>
                                <span class="token keyword">break</span><span class="token punctuation">;</span>
                            <span class="token keyword">continue</span><span class="token punctuation">;</span>           <span class="token comment">// Slot is now non-empty</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                    collide <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>wasUncontended<span class="token punctuation">)</span>       <span class="token comment">// CAS already known to fail</span>
                    wasUncontended <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>      <span class="token comment">// Continue after rehash</span>
                <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>a<span class="token punctuation">.</span><span class="token function">cas</span><span class="token punctuation">(</span>v <span class="token operator">=</span> a<span class="token punctuation">.</span>value<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>fn <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">?</span> v <span class="token operator">+</span> x <span class="token operator">:</span>
                                             fn<span class="token punctuation">.</span><span class="token function">applyAsLong</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
                <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">>=</span> <span class="token constant">NCPU</span> <span class="token operator">||</span> cells <span class="token operator">!=</span> as<span class="token punctuation">)</span>
                    collide <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>            <span class="token comment">// At max size or stale</span>
                <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>collide<span class="token punctuation">)</span>
                    collide <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
                <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>cellsBusy <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> <span class="token function">casCellsBusy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">try</span> <span class="token punctuation">{</span>
                        <span class="token keyword">if</span> <span class="token punctuation">(</span>cells <span class="token operator">==</span> as<span class="token punctuation">)</span> <span class="token punctuation">{</span>      <span class="token comment">// Expand table unless stale</span>
                            <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> rs <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">[</span>n <span class="token operator">&lt;&lt;</span> <span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
                            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> n<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span>
                                rs<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> as<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
                            cells <span class="token operator">=</span> rs<span class="token punctuation">;</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                        cellsBusy <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    collide <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                    <span class="token keyword">continue</span><span class="token punctuation">;</span>                   <span class="token comment">// Retry with expanded table</span>
                <span class="token punctuation">}</span>
                h <span class="token operator">=</span> <span class="token function">advanceProbe</span><span class="token punctuation">(</span>h<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>cellsBusy <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> cells <span class="token operator">==</span> as <span class="token operator">&amp;&amp;</span> <span class="token function">casCellsBusy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">boolean</span> init <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>                           <span class="token comment">// Initialize table</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>cells <span class="token operator">==</span> as<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> rs <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
                        rs<span class="token punctuation">[</span>h <span class="token operator">&amp;</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Cell</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>
                        cells <span class="token operator">=</span> rs<span class="token punctuation">;</span>
                        init <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                    cellsBusy <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>init<span class="token punctuation">)</span>
                    <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">casBase</span><span class="token punctuation">(</span>v <span class="token operator">=</span> base<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>fn <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">?</span> v <span class="token operator">+</span> x <span class="token operator">:</span>
                                        fn<span class="token punctuation">.</span><span class="token function">applyAsLong</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>                          <span class="token comment">// Fall back on using base</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-8-accumulator累加器" tabindex="-1"><a class="header-anchor" href="#_4-8-accumulator累加器" aria-hidden="true">#</a> 4.8 Accumulator累加器</h2>
<p>accumulator累加器其实是LongAdder的升级版本，主要是改变了累加的功能，LongAdder只能固定每次累加1，而accumulator可以指定累加的业务逻辑，可以是相加，可以是相乘，取决于构造函数的第一个参数表达式<strong>new LongAccumulator((x,y)-&gt;x * y,0);</strong></p>
<p>以下为实例代码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>atomic<span class="token punctuation">.</span></span><span class="token class-name">LongAccumulator</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>stream<span class="token punctuation">.</span></span><span class="token class-name">IntStream</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-21
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AccumulatorDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">LongAccumulator</span> accumulator <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LongAccumulator</span><span class="token punctuation">(</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span>y<span class="token punctuation">)</span><span class="token operator">-></span>x <span class="token operator">*</span> y<span class="token punctuation">,</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">IntStream</span><span class="token punctuation">.</span><span class="token function">range</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token operator">-></span>executorService<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">-></span>accumulator<span class="token punctuation">.</span><span class="token function">accumulate</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span><span class="token punctuation">(</span><span class="token operator">!</span>executorService<span class="token punctuation">.</span><span class="token function">isTerminated</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>

        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>accumulator<span class="token punctuation">.</span><span class="token function">getThenReset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>accumulator原理：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/202110212050006.png" alt="image-20211021205031762"></p>
<p>在Striped64类中，存在三个成员变量：<strong>base、cellsBusy、Cell数组</strong>，base:就是用来计算线程每次计算的值，分别是多个CPU核来保存或者是直接保存在base变量中</p>
<p>获取数据值的方法：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">long</span> <span class="token function">getThenReset</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> as <span class="token operator">=</span> cells<span class="token punctuation">;</span> <span class="token class-name">Cell</span> a<span class="token punctuation">;</span>
    <span class="token comment">// 其实base初始值也是在构造函数中赋值的，this.base=identity=构造函数传递的值</span>
    <span class="token keyword">long</span> result <span class="token operator">=</span> base<span class="token punctuation">;</span>
    <span class="token comment">// identity 是传递的初始值，构造函数传递</span>
    base <span class="token operator">=</span> identity<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>as <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    	<span class="token comment">// 判断cell插槽数据是否为空，不为空直接统计数据插槽中求和的数据</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> as<span class="token punctuation">.</span>length<span class="token punctuation">;</span> <span class="token operator">++</span>i<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>a <span class="token operator">=</span> as<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">long</span> v <span class="token operator">=</span> a<span class="token punctuation">.</span>value<span class="token punctuation">;</span>
                a<span class="token punctuation">.</span>value <span class="token operator">=</span> identity<span class="token punctuation">;</span>
                <span class="token comment">// 调用构造函数传递的计算函数，调用函数表达式进行数据生成</span>
                result <span class="token operator">=</span> function<span class="token punctuation">.</span><span class="token function">applyAsLong</span><span class="token punctuation">(</span>result<span class="token punctuation">,</span> v<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> result<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>累加器方法：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Updates with the given value.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">x</span> the value
 */</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">accumulate</span><span class="token punctuation">(</span><span class="token keyword">long</span> x<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Cell</span><span class="token punctuation">[</span><span class="token punctuation">]</span> as<span class="token punctuation">;</span> <span class="token keyword">long</span> b<span class="token punctuation">,</span> v<span class="token punctuation">,</span> r<span class="token punctuation">;</span> <span class="token keyword">int</span> m<span class="token punctuation">;</span> <span class="token class-name">Cell</span> a<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>as <span class="token operator">=</span> cells<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">||</span>
        <span class="token punctuation">(</span>r <span class="token operator">=</span> function<span class="token punctuation">.</span><span class="token function">applyAsLong</span><span class="token punctuation">(</span>b <span class="token operator">=</span> base<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> b <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">casBase</span><span class="token punctuation">(</span>b<span class="token punctuation">,</span> r<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">boolean</span> uncontended <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>as <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token punctuation">(</span>m <span class="token operator">=</span> as<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">||</span>
            <span class="token punctuation">(</span>a <span class="token operator">=</span> as<span class="token punctuation">[</span><span class="token function">getProbe</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> m<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span>
            <span class="token operator">!</span><span class="token punctuation">(</span>uncontended <span class="token operator">=</span>
              <span class="token punctuation">(</span>r <span class="token operator">=</span> function<span class="token punctuation">.</span><span class="token function">applyAsLong</span><span class="token punctuation">(</span>v <span class="token operator">=</span> a<span class="token punctuation">.</span>value<span class="token punctuation">,</span> x<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> v <span class="token operator">||</span>
              a<span class="token punctuation">.</span><span class="token function">cas</span><span class="token punctuation">(</span>v<span class="token punctuation">,</span> r<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
              <span class="token comment">// 调用父类总的longAccumulate方法，进行cpu的各种计算</span>
            <span class="token function">longAccumulate</span><span class="token punctuation">(</span>x<span class="token punctuation">,</span> function<span class="token punctuation">,</span> uncontended<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用场景：</p>
<ul>
<li>适合于需要大量计算，是需要并行计算</li>
<li>计算的顺序不能成为瓶颈，就是跟线程执行的顺序无关</li>
</ul>
<p>注意点：</p>
<ul>
<li>accumulator计算的值不一定是准确的，因为getThenReset()方法中，就是直接去获取一次cell中的累加值，也许还没有计算完毕</li>
</ul>
<h1 id="_5-cas" tabindex="-1"><a class="header-anchor" href="#_5-cas" aria-hidden="true">#</a> 5. CAS</h1>
<h3 id="_1-什么是cas" tabindex="-1"><a class="header-anchor" href="#_1-什么是cas" aria-hidden="true">#</a> 1. 什么是CAS</h3>
<p>​	Compare And Set比较与交换</p>
<p>​	CAS有三个操作数：内存值V、预期值A、要修改的值B，<strong>当且仅当预期值A和内存值V相同时，才能将内存值修改为B，否则什么也不做，最后返回现在的V值</strong></p>
<p>CAS主要是利用CPU的特殊指令来控制</p>
<h3 id="_2-cas使用场景" tabindex="-1"><a class="header-anchor" href="#_2-cas使用场景" aria-hidden="true">#</a> 2. CAS使用场景</h3>
<pre><code>	- 乐观锁
	- 并发容器，ConcurrentHashMap
	- 原子类 AtomicInteger 
</code></pre>
<p>​				a. 加载Unsafe类</p>
<p>​				b. volatile 修饰变量</p>
<p>​				c. compareAndSwapInt 处理</p>
<h3 id="_3-总结" tabindex="-1"><a class="header-anchor" href="#_3-总结" aria-hidden="true">#</a> 3.总结</h3>
<p>​	缺点：</p>
<p>​		ABA问题:  可以利用版本号解决</p>
<p>​		自旋时间过长： CPU性能损耗过大</p>
<p>​		不能保证代码块的原子性，只能保证变量的原子性</p>
<h1 id="_6-final关键字和java中的不变性" tabindex="-1"><a class="header-anchor" href="#_6-final关键字和java中的不变性" aria-hidden="true">#</a> 6. final关键字和java中的不变性</h1>
<p>​	final修饰的变量，都无法编译，无法修改</p>
<p>​	如果对象<strong>在创建后，状态就不能被修改</strong>，那么它就是不可变的。</p>
<p>​	例如：Person 类中有private final int age=18,那么该类就是不可变，但是如果还有另外一个public int score=0;这就破坏了不变性；</p>
<p>​	不可变的对象一定是线程安全的，我们不需要对其采用任何的额外安全措施，也能保证线程安全</p>
<p><strong>final的作用域： 类（防止被继承），方法（防止被重写），变量（防止被修改）</strong></p>
<p>赋值时机：</p>
<p>​	类变量赋值private final int a;</p>
<p>​		 1. 直接赋值，2.{}代码块赋值，3.构造函数赋值</p>
<p>​	类变量static修饰变量赋值private static final int a;</p>
<p>​			1. 直接赋值，2.static{}静态代码块赋值</p>
<p>​	方法中的变量final int a;</p>
<p>​			只要求在使用前赋值</p>
<p><strong>构造方法不允许使用fianl修饰</strong></p>
<p>父类的static修饰的方法子类也不能添加overrride，但是可以在子类中写一个同样的方法，原因是： static静态的是在类初始化的时候就被创建了，这样产生的两个方法是属于两个类，子类和父类分别存在一个。</p>
<p><strong>final修饰对象的时候，只是对象的引用不可变，而对象本身的属性是可以变化的。</strong></p>
<p>不变性和final的关系：</p>
<ul>
<li>
<p>不变性并不意味着，简单地使用final修饰就是不可变</p>
</li>
<li>
<p>对于基本数据类型，final修饰后就是具有不变性</p>
</li>
<li>
<p>对于对象类型，需要对该对象保证自身被创建后，状态永远不会变才可以（对象中所有属性都是不可变，且属性为基本数据类型）。</p>
</li>
<li>
<p>如果对象包含对象变量，但是变量不可能被更改，也是不可变的</p>
</li>
</ul>
<p><strong>栈封闭技术： 栈是线程私有，方法内变量是栈内变量</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-12
 * 面试题
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo1</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">String</span> a <span class="token operator">=</span> <span class="token string">"leisansui2"</span><span class="token punctuation">;</span> <span class="token comment">// 常量池</span>
        <span class="token keyword">final</span> <span class="token class-name">String</span> b <span class="token operator">=</span> <span class="token string">"leisansui"</span><span class="token punctuation">;</span> <span class="token comment">// 直接不可变，放到常量池，直接就当成常量使用</span>
        <span class="token class-name">String</span> d <span class="token operator">=</span> <span class="token string">"leisansui"</span><span class="token punctuation">;</span> <span class="token comment">// 常量池</span>
        <span class="token class-name">String</span> c <span class="token operator">=</span> b <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">;</span> <span class="token comment">// b是一个可以确定的常量，那么在编译时期就知道是什么，所以得到的值就是leisansui2,由于在常量中</span>
        <span class="token class-name">String</span> e <span class="token operator">=</span> d <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">;</span> <span class="token comment">// d是常量池中的值，但是由于编译器在运行期间才知道d的值是什么，所以就会在堆上生成e的对象，那么e是一个引用</span>
        <span class="token comment">// true</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token punctuation">(</span>a <span class="token operator">==</span> c<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// c=b+2,得到的是一个字符串，那么就去常量池中查找，得到和a相同，那么就返回a的引用。所以相同</span>
        <span class="token comment">// false</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token punctuation">(</span>a <span class="token operator">==</span> e<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> 
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
解释： 
<span class="token boolean">true</span>
<span class="token boolean">false</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>String相关知识点：</p>
<p>String在1.6时期，存在一个Pem区，并且和堆是两块独立区域，常量池在该区域。</p>
<p>String在1.7时期，取消Pem区，常量池移入堆区。</p>
<p>String在1.8时期，取消永久代，使用元数据Metaspace替代。</p>
<ol>
<li>String a = &quot;a&quot;; 生成在常量池中，是一个常量，遇到这一句代码是，jvm会先去常量池寻找是否有a的值，有就直接a=“a&quot;常量池地址的引用，没有就创建后放入常量池</li>
<li>String a = new String(&quot;a&quot;) 是生成在堆上</li>
<li>final String a  = &quot;a&quot;; 是一个常量，编译时期就知道是不可变</li>
</ol>
<h1 id="_7-concurrenthashmap等并发集合" tabindex="-1"><a class="header-anchor" href="#_7-concurrenthashmap等并发集合" aria-hidden="true">#</a> 7. ConcurrentHashMap等并发集合</h1>
<h2 id="_7-1-概览" tabindex="-1"><a class="header-anchor" href="#_7-1-概览" aria-hidden="true">#</a> 7.1 概览</h2>
<p>ConcurrentHashMap:线程安全的HashMap</p>
<p>CopyOnWriteArrayList: 线程安全的List</p>
<p>BlockingQueue: 这是一个接口，表示阻塞队列，非常适合用于做为数据共享的通道</p>
<p>ConcurrentLinkedQueue: 高效的非阻塞并发队列，可以看到做是一个线程安全的LinkedList</p>
<p>ConcurrentSkipListMap: 是一个Map，实用跳表的数据结构进行快速查找</p>
<h2 id="_7-2-集合类的历史" tabindex="-1"><a class="header-anchor" href="#_7-2-集合类的历史" aria-hidden="true">#</a> 7.2 集合类的历史</h2>
<ul>
<li>
<p>Vector和Hashtable</p>
<p>Vector可以作为ArrayList,方法全部由synchronized方法修饰</p>
<p>Hashtable当做普通的HashMap,方法全部由synchronized方法修饰</p>
<p><strong>并发性能差，但是线程安全</strong></p>
</li>
<li>
<p>ArrayList和HashMap</p>
<p><strong>线程不安全</strong>，可以使用<code v-pre>Collections.synchronizedList(new ArrayList&lt;E&gt;())</code>和<code v-pre>Collections.synchronizedMap(new HashMap&lt;K,V&gt;())</code>包装之后变成线程安全的。包装类保证线程安全的原理： 是使用了<strong>synchronized</strong>的同步代码块来保证线程安全</p>
</li>
<li>
<p>ConcurrentHashMap和CopyOnWriteArrayList</p>
<p>主要是取代ArrayList和HashMap的线程不安全</p>
<p>绝大多数的并发情况下，ConcurrentHashMap和CopyOnWriteArrayList的性能要更好</p>
</li>
</ul>
<h2 id="_7-3-map接口" tabindex="-1"><a class="header-anchor" href="#_7-3-map接口" aria-hidden="true">#</a> 7.3 Map接口</h2>
<p>实现： HashMap,Hashtable, LinkedHashMap,TreeMap</p>
<img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112141253089.png" alt="image-20211112141253089" style="zoom: 200%;" />
<ul>
<li>
<p>HashMap</p>
<p>使用hash作为key，提供快速访问值，key可以为null,值不限制,线程不安全</p>
</li>
<li>
<p>Hashtable</p>
</li>
</ul>
<p>​		<strong>线程安全</strong>,key不允许为空</p>
<ul>
<li>LinkedHashMap</li>
</ul>
<p>​		<strong>线程不安全</strong>，key允许为null</p>
<ul>
<li>
<p>TreeMap</p>
<p>实现了Sort接口，可以得到排序，<strong>线程不安全</strong>,key不允许为null</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112142346743.png" alt="image-20211112142346743"></p>
</li>
</ul>
<h2 id="_7-4-hashmap的死循环-cpu100-问题" tabindex="-1"><a class="header-anchor" href="#_7-4-hashmap的死循环-cpu100-问题" aria-hidden="true">#</a> 7.4 HashMap的死循环，CPU100%问题</h2>
<p>原因： 多个线程同时扩容，导致链表互相指向，导致出现环形链表，进而出现死循环</p>
<p><a href="https://coolshell.cn/articles/9606.html" target="_blank" rel="noopener noreferrer"> 原理文章<ExternalLinkIcon/></a></p>
<h2 id="_7-5-hashmap特点" tabindex="-1"><a class="header-anchor" href="#_7-5-hashmap特点" aria-hidden="true">#</a> 7.5 HashMap特点</h2>
<p>红黑树：R-B Tree，全称是Red-Black Tree，又称为“红黑树”，它一种特殊的二叉查找树。红黑树的每个节点上都有存储位表示节点的颜色，可以是红(Red)或黑(Black)。</p>
<p><strong>红黑树的特性</strong>:
<strong>（1）每个节点或者是黑色，或者是红色。</strong>
<strong>（2）根节点是黑色。</strong>
<strong>（3）每个叶子节点（NIL）是黑色。 [注意：这里叶子节点，是指为空(NIL或NULL)的叶子节点！]</strong>
<strong>（4）如果一个节点是红色的，则它的子节点必须是黑色的。</strong>
<strong>(5）从一个节点到该节点的子孙节点的所有路径上包含相同数目的黑节点。</strong></p>
<p><strong>特点</strong></p>
<ol>
<li>非线程安全</li>
<li>迭代时不允许修改内容</li>
<li>只读是并发安全的</li>
<li>如果一定要把HashMap在并发环境，那么使用Collections.synchronizedMap(new Hash())来包装</li>
</ol>
<h2 id="_7-6-concurrenthashmap在java7-8版本的区别" tabindex="-1"><a class="header-anchor" href="#_7-6-concurrenthashmap在java7-8版本的区别" aria-hidden="true">#</a> 7.6 ConcurrentHashMap在Java7/8版本的区别</h2>
<p>Java 7：</p>
<ul>
<li>
<p>中的ConcurrentHashMap最外层是多个segment,每个segment的底层数据结构与HashMap类似，仍然使用数组和链表组成的拉链法</p>
</li>
<li>
<p>每个Segment独立上ReentrantLock锁，每个segment之间互不影响，提高并发效率</p>
</li>
<li>
<p>ConcurrentHashMap默认有16个segment，所以最多支持16线程并发写（操作分布在不同的segment上）。这个默认值可以在初始化的时候设置为其他值，但是后续不能更改扩容。</p>
</li>
</ul>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112152344788.png" alt="image-20211112152344788"></p>
<p>Java 8：</p>
<ul>
<li>
<p>存储结构完全跟HashMap相同，利用红黑树，链表等数据结构，每一个Node都是独立的</p>
</li>
<li>
<p>完全重写了ConcurrentHashMap整个代码，主要底层使用同步代码块synchronized+CAS</p>
</li>
<li>
<p>key或value为null，直接会抛出异常</p>
</li>
</ul>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112152232816.png" alt="image-20211112152232816"></p>
<p>put方法，putVal方法大致流程</p>
<ul>
<li>判断key,value是否为空，为空抛出异常</li>
<li>计算key的hash值</li>
<li>根据对应的节点类型进行赋值，或者进行helpTransfer,或者增长链表，或者给红黑树增加节点</li>
<li>检查是否满足阈值8，需要进行链表转红黑树，且在转换前还要判断数组长度必须大于64</li>
<li>返回原始旧值oldVal</li>
</ul>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/** Implementation for put and putIfAbsent */</span>
<span class="token keyword">final</span> <span class="token class-name">V</span> <span class="token function">putVal</span><span class="token punctuation">(</span><span class="token class-name">K</span> key<span class="token punctuation">,</span> <span class="token class-name">V</span> value<span class="token punctuation">,</span> <span class="token keyword">boolean</span> onlyIfAbsent<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// 处理key,value是否为空</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>key <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> value <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NullPointerException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 计算hash值</span>
    <span class="token keyword">int</span> hash <span class="token operator">=</span> <span class="token function">spread</span><span class="token punctuation">(</span>key<span class="token punctuation">.</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">int</span> binCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token comment">// 循环存储的数据节点</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> tab <span class="token operator">=</span> table<span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> f<span class="token punctuation">;</span> <span class="token keyword">int</span> n<span class="token punctuation">,</span> i<span class="token punctuation">,</span> fh<span class="token punctuation">;</span>
        <span class="token comment">// 判断数组是否为空，为空需要进行初始化</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>tab <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> <span class="token punctuation">(</span>n <span class="token operator">=</span> tab<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
        	<span class="token comment">// 初始化数据数组</span>
            tab <span class="token operator">=</span> <span class="token function">initTable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>f <span class="token operator">=</span> <span class="token function">tabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i <span class="token operator">=</span> <span class="token punctuation">(</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> hash<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        	<span class="token comment">// 判断数组中的该hash出来的位置是否为空，为空直接进行数据的cas插入</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">casTabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
                         <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span> value<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>                   <span class="token comment">// no lock when adding to empty bin</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 不为空，判断该节点是否为一个MOVED节点类型，hash for forwarding nodes转移节点</span>
        <span class="token comment">// MOVED=-1,就是计算hash的时候，如果hash值为-1，就说明该位置正在进行扩容等相关操作</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>fh <span class="token operator">=</span> f<span class="token punctuation">.</span>hash<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token constant">MOVED</span><span class="token punctuation">)</span>
        	<span class="token comment">// 帮助进行 扩容</span>
            tab <span class="token operator">=</span> <span class="token function">helpTransfer</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> f<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token class-name">V</span> oldVal <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
            <span class="token comment">// 进行同步代码块锁定，f为当前节点的值</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>f<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            	<span class="token comment">// 判断是否为链表节点</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">tabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">)</span> <span class="token operator">==</span> f<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                	<span class="token comment">// 判断hash值大于0</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>fh <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        binCount <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
                        <span class="token comment">// 循环链表进行追加数据</span>
                        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> e <span class="token operator">=</span> f<span class="token punctuation">;</span><span class="token punctuation">;</span> <span class="token operator">++</span>binCount<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            <span class="token class-name">K</span> ek<span class="token punctuation">;</span>
                            <span class="token comment">// hash相同，value也相同，直接覆盖原来的数据</span>
                            <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash <span class="token operator">==</span> hash <span class="token operator">&amp;&amp;</span>
                                <span class="token punctuation">(</span><span class="token punctuation">(</span>ek <span class="token operator">=</span> e<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token operator">==</span> key <span class="token operator">||</span>
                                 <span class="token punctuation">(</span>ek <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> key<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>ek<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                oldVal <span class="token operator">=</span> e<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
                                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>onlyIfAbsent<span class="token punctuation">)</span>
                                    e<span class="token punctuation">.</span>val <span class="token operator">=</span> value<span class="token punctuation">;</span>
                                <span class="token keyword">break</span><span class="token punctuation">;</span>
                            <span class="token punctuation">}</span>
                            <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> pred <span class="token operator">=</span> e<span class="token punctuation">;</span>
                            <span class="token comment">// 追加在最后面</span>
                            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>e <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                                pred<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span>
                                                          value<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                                <span class="token keyword">break</span><span class="token punctuation">;</span>
                            <span class="token punctuation">}</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                    <span class="token comment">// 判断是否为红黑树</span>
                    <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>f <span class="token keyword">instanceof</span> <span class="token class-name">TreeBin</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> p<span class="token punctuation">;</span>
                        binCount <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
                        <span class="token comment">// 进行树节点插入</span>
                        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>p <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">TreeBin</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span><span class="token punctuation">)</span>f<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">putTreeVal</span><span class="token punctuation">(</span>hash<span class="token punctuation">,</span> key<span class="token punctuation">,</span>
                                                       value<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            oldVal <span class="token operator">=</span> p<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
                            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>onlyIfAbsent<span class="token punctuation">)</span>
                                p<span class="token punctuation">.</span>val <span class="token operator">=</span> value<span class="token punctuation">;</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// 判断是否发生了节点变化的操作，链表的binCount会支持增加，红黑树只能为2</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>binCount <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            	<span class="token comment">// 判断是否触发链表转换红黑树，阈值8</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>binCount <span class="token operator">>=</span> <span class="token constant">TREEIFY_THRESHOLD</span><span class="token punctuation">)</span>
                	<span class="token comment">// 转换红黑树</span>
                    <span class="token function">treeifyBin</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> i<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>oldVal <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
                	<span class="token comment">// 返回旧值</span>
                    <span class="token keyword">return</span> oldVal<span class="token punctuation">;</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 统计目前数组的长度</span>
    <span class="token function">addCount</span><span class="token punctuation">(</span><span class="token number">1L</span><span class="token punctuation">,</span> binCount<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>get方法，大致流程</p>
<ul>
<li>计算key的hash值</li>
<li>找到对应的位置，根据情况进行：
<ol>
<li>直接取值</li>
<li>红黑树中寻找</li>
<li>遍历链表取值</li>
<li>返回寻找的结果</li>
</ol>
</li>
</ul>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">V</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token class-name">Object</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> tab<span class="token punctuation">;</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">K</span><span class="token punctuation">,</span><span class="token class-name">V</span><span class="token punctuation">></span></span> e<span class="token punctuation">,</span> p<span class="token punctuation">;</span> <span class="token keyword">int</span> n<span class="token punctuation">,</span> eh<span class="token punctuation">;</span> <span class="token class-name">K</span> ek<span class="token punctuation">;</span>
    <span class="token comment">// 计算hash值</span>
    <span class="token keyword">int</span> h <span class="token operator">=</span> <span class="token function">spread</span><span class="token punctuation">(</span>key<span class="token punctuation">.</span><span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 判断数组是否存在数据，并且获取出节点值不为null</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>tab <span class="token operator">=</span> table<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>n <span class="token operator">=</span> tab<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span>
        <span class="token punctuation">(</span>e <span class="token operator">=</span> <span class="token function">tabAt</span><span class="token punctuation">(</span>tab<span class="token punctuation">,</span> <span class="token punctuation">(</span>n <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">&amp;</span> h<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 判断节点获取的值的的hash值是否相等</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>eh <span class="token operator">=</span> e<span class="token punctuation">.</span>hash<span class="token punctuation">)</span> <span class="token operator">==</span> h<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        	<span class="token comment">// 判断原始key是否相等，相等就返回存储的value值</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>ek <span class="token operator">=</span> e<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token operator">==</span> key <span class="token operator">||</span> <span class="token punctuation">(</span>ek <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> key<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>ek<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span> e<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 获取到的hash&lt;0</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>eh <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
        	<span class="token comment">// 从红黑树中寻找节点</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span>p <span class="token operator">=</span> e<span class="token punctuation">.</span><span class="token function">find</span><span class="token punctuation">(</span>h<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">?</span> p<span class="token punctuation">.</span>val <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token comment">// 从链表中循环取出数据</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>e <span class="token operator">=</span> e<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>e<span class="token punctuation">.</span>hash <span class="token operator">==</span> h <span class="token operator">&amp;&amp;</span>
                <span class="token punctuation">(</span><span class="token punctuation">(</span>ek <span class="token operator">=</span> e<span class="token punctuation">.</span>key<span class="token punctuation">)</span> <span class="token operator">==</span> key <span class="token operator">||</span> <span class="token punctuation">(</span>ek <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> key<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>ek<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token keyword">return</span> e<span class="token punctuation">.</span>val<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Java8、7区别：</p>
<ul>
<li>
<p>数据结构区别</p>
<p>7： segment结构，segment独立，8：链表+红黑树，每个Node单独</p>
</li>
<li>
<p>Hash碰撞</p>
<p>7： 直接使用拉链法，8：先使用拉链法，后使用红黑树</p>
</li>
<li>
<p>保证并发安全</p>
<p>7： 使用segment继承ReentrantLock，8： sychronized代码块+cas</p>
</li>
<li>
<p>查询复杂度</p>
<p>7： O(n), 8: O(logn)</p>
</li>
</ul>
<p>为什么链表长度8就要转换为红黑树？</p>
<p>答： 数据量不多的时候，不需要转换，红黑树占用空间比链表更大，想要达到链表长度为8的概率都比较小，概率为千万级别，所以选择8是一个概率值。</p>
<p>​		不过理想情况下随机hashCode算法下所有bin中节点的分布频率会遵循<strong>泊松分布</strong>，我们可以看到，一个bin中链表长度达到8个元素的概率为0.00000006，几乎是不可能事件。</p>
<h2 id="_7-7-组合操作不保证线程安全" tabindex="-1"><a class="header-anchor" href="#_7-7-组合操作不保证线程安全" aria-hidden="true">#</a> 7.7 组合操作不保证线程安全</h2>
<p>其实ConcurrentHashMap保证的是已经存在了的数据是线程安全，比如：get,put动作是线程安全的，但是组合操作：get,然后操作数据，put，那么这三个动作不是线程安全的。</p>
<p>保证安全：</p>
<ol>
<li>
<p>组合操作代码添加同步代码块</p>
</li>
<li>
<p>使用replace方法，多次检查是否是可以修改</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>while(true){
	boolean b = hashMap.replace(key,oldValue,newValue);
	if(b){
		break;
	}
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<p>putIfAbsent方法：</p>
<p>​	对key进行赋值，如果有key存在值，那么返回值，不存在key，返回null,可以避免使用</p>
<div class="language-text ext-text line-numbers-mode"><pre v-pre class="language-text"><code>if(!map.contains(key)){
	// 获取值
}else {
	// 存在key,进行修改值
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>​	<strong>该方法直接调用的是putVal方法，但是第三个参数onlyIfAbsent为true,该参数控制putVal的值是否需要被修改，true=返回key得到的值，false=返回key得到的值，并且对key修改值。</strong></p>
<h2 id="_7-8-copyonwritearraylist" tabindex="-1"><a class="header-anchor" href="#_7-8-copyonwritearraylist" aria-hidden="true">#</a> 7.8 CopyOnWriteArrayList</h2>
<p>Vector和SychronizedList的锁粒度太大，并发效率相对较低，并且迭代时无法编辑</p>
<p>Copy-On-Write并发容易还包括CopyOnWriteArraySet用来替代Set集合</p>
<p>CopyOnWriteArrayList使用场景：</p>
<ul>
<li>读操作尽可能快，而写操作慢一些都没有关系</li>
<li>读多写少： 黑名单，每日更新；监听器：迭代操作远多于修改操作</li>
</ul>
<p><strong>读写锁规则：读读共享，其他都互斥</strong></p>
<p>CopyOnWrite的读写规则：</p>
<p><strong>读取是完全不需要加锁，并且更厉害的是，写入也不会阻塞其他操作。只有线程都是写写才会进行互斥。</strong></p>
<p>CopyOnWrite的含义：</p>
<p>​	复制-写入</p>
<p>是一种程序设计中的优化策略，其实现思路是大家都在共享一个内容，当有人想要修改内容的时候，就创建一个改内容的副本，对副本进行修改，然后再将原本的引用指向副本，完成内容的修改。是一种读写分离的并发策略，也是一种延时惰性策略</p>
<p><strong>缺点：</strong></p>
<ul>
<li>数据一致性：CopyOnWrite容器只能保证最终一致性，无法保证实时一致性</li>
<li>内存占用问题： 因为CopyOnWrite的写是复制机制，每次写都上锁，并且复制一份数据拷贝，内存中会同时存在两个对象</li>
</ul>
<p><strong>数据结构：</strong></p>
<p>​	ReentrantLock是锁</p>
<p>​	存储是Object[] 数组</p>
<p><strong>add方法源码：</strong></p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Appends the specified element to the end of this list.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">e</span> element to be appended to this list
 * <span class="token keyword">@return</span> <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">true</span></span></span><span class="token punctuation">}</span> (as specified by <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">Collection</span><span class="token punctuation">#</span><span class="token field">add</span></span><span class="token punctuation">}</span>)
 */</span>
<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token comment">// 获取锁</span>
    <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> lock <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>lock<span class="token punctuation">;</span>
    <span class="token comment">// 进行枷锁</span>
    lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
    	<span class="token comment">// 得到当前的数组的引用</span>
        <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> elements <span class="token operator">=</span> <span class="token function">getArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">int</span> len <span class="token operator">=</span> elements<span class="token punctuation">.</span>length<span class="token punctuation">;</span>
        <span class="token comment">// 调用系统方法进行拷贝，并且长度+1</span>
        <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> newElements <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elements<span class="token punctuation">,</span> len <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 对最后一个位置进行复制</span>
        newElements<span class="token punctuation">[</span>len<span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span>
        <span class="token comment">// 然后重新进行引用设置</span>
        <span class="token function">setArray</span><span class="token punctuation">(</span>newElements<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    	<span class="token comment">// 释放锁</span>
        lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-9-并发队列queue-阻塞队列" tabindex="-1"><a class="header-anchor" href="#_7-9-并发队列queue-阻塞队列" aria-hidden="true">#</a> 7.9 并发队列Queue：阻塞队列</h2>
<p>Queue接口：</p>
<ul>
<li>LinkedBlockingQueue</li>
<li>ArrayListBlockingQueue</li>
<li>PriorityBlockingQueue</li>
<li>SynchronousQueue</li>
</ul>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112163918406.png" alt="image-20211112163918406"></p>
<p>​	什么是阻塞队列？</p>
<p>​		阻塞队列具有阻塞功能的队列</p>
<p>​		阻塞队列是否有界：这是一个非常重要的属性，无界队列意味着容量为Integer.MAX_VALUE。</p>
<h3 id="arrayblockingqueue" tabindex="-1"><a class="header-anchor" href="#arrayblockingqueue" aria-hidden="true">#</a> ArrayBlockingQueue</h3>
<ol>
<li>
<p>有界,构造是必须传递一个长度</p>
</li>
<li>
<p>是否公平</p>
<p>如果想要保证公平的话，那么等待了最长时间的线程会被优先处理，不过这同时会带来性能上的损耗</p>
</li>
</ol>
<h3 id="linkedblockingqueue" tabindex="-1"><a class="header-anchor" href="#linkedblockingqueue" aria-hidden="true">#</a> LinkedBlockingQueue</h3>
<p>使用链表作为数据结构</p>
<ul>
<li>
<p>无界队列</p>
</li>
<li>
<p>容量为Integer.MAX_VALUE</p>
</li>
<li>
<p>内部结构： Node节点，并且存在两把同步锁</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211112170819536.png" alt="image-20211112170819536"></p>
</li>
</ul>
<p>分析put方法：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Inserts the specified element at the tail of this queue, waiting if
 * necessary for space to become available.
 *
 * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">InterruptedException</span></span> <span class="token punctuation">{</span><span class="token keyword">@inheritDoc</span><span class="token punctuation">}</span>
 * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">NullPointerException</span></span> <span class="token punctuation">{</span><span class="token keyword">@inheritDoc</span><span class="token punctuation">}</span>
 */</span>
<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
	<span class="token comment">// 元素不允许为空</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>e <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NullPointerException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Note: convention in all put/take/etc is to preset local var</span>
    <span class="token comment">// holding count negative to indicate failure unless set.</span>
    <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
    <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 获取插入锁</span>
    <span class="token keyword">final</span> <span class="token class-name">ReentrantLock</span> putLock <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>putLock<span class="token punctuation">;</span>
    <span class="token comment">// 利用原子类AtomicInteger来保证长度修改是线程安全</span>
    <span class="token keyword">final</span> <span class="token class-name">AtomicInteger</span> count <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>count<span class="token punctuation">;</span>
    <span class="token comment">// 获取可以响应中断的锁</span>
    putLock<span class="token punctuation">.</span><span class="token function">lockInterruptibly</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token comment">/*
         * Note that count is used in wait guard even though it is
         * not protected by lock. This works because count can
         * only decrease at this point (all other puts are shut
         * out by lock), and we (or some other waiting put) are
         * signalled if it ever changes from capacity. Similarly
         * for all other uses of count in other wait guards.
         */</span>
         <span class="token comment">// 如果长度到了，那么就进行等待</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>count<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> capacity<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            notFull<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 放入队列</span>
        <span class="token function">enqueue</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 队列中的元素+1</span>
        c <span class="token operator">=</span> count<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 如果元素小于初始容量，那么进行通知唤醒休眠线程</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">+</span> <span class="token number">1</span> <span class="token operator">&lt;</span> capacity<span class="token punctuation">)</span>
            notFull<span class="token punctuation">.</span><span class="token function">signal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
    <span class="token comment">// 解锁</span>
        putLock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token function">signalNotEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="priorityblockingqueue" tabindex="-1"><a class="header-anchor" href="#priorityblockingqueue" aria-hidden="true">#</a> PriorityBlockingQueue</h3>
<p>具有排序的队列，支持优先级，并且是自然排序（不是先进先出），是一个无界队列，插入的东西必须是可以比较的</p>
<h3 id="synchronousqueue" tabindex="-1"><a class="header-anchor" href="#synchronousqueue" aria-hidden="true">#</a> SynchronousQueue</h3>
<p>容量为0</p>
<p>特别注意的是： SynchronousQueue的容量不是1而是0，因为SynchronousQueue不需要持有元素，它所做的就是直接传递（direct handoff）</p>
<p>由于不存储，效率较高</p>
<p>注意：</p>
<p>SynchronousQueue没有peek等函数，</p>
<p>是一个直接交换的并发数据结构</p>
<p>SynchronousQueue是线程池Executors.newCachedThreadPool()的工作队列</p>
<h3 id="delayqueue" tabindex="-1"><a class="header-anchor" href="#delayqueue" aria-hidden="true">#</a> DelayQueue</h3>
<p>延时队列，根据排序时间排序</p>
<p>元素必须实现Delayed接口，规定排序规则</p>
<p>是一个无界队列</p>
<h3 id="非阻塞并发队列-concurrentlinkedqueue" tabindex="-1"><a class="header-anchor" href="#非阻塞并发队列-concurrentlinkedqueue" aria-hidden="true">#</a> 非阻塞并发队列：ConcurrentLinkedQueue</h3>
<p>ConcurrentLinkedQueue: 是使用链表作为数据结构，并且是CAS非阻塞算法来实现线程安全（不具备阻塞功能），适合用在对性能要求较高的并发场景。</p>
<p>offer方法：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * Inserts the specified element at the tail of this queue.
 * As the queue is unbounded, this method will never return <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">false</span></span></span><span class="token punctuation">}</span>.
 *
 * <span class="token keyword">@return</span> <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">true</span></span></span><span class="token punctuation">}</span> (as specified by <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">Queue</span><span class="token punctuation">#</span><span class="token field">offer</span></span><span class="token punctuation">}</span>)
 * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">NullPointerException</span></span> if the specified element is null
 */</span>
<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">offer</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">checkNotNull</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> newNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> t <span class="token operator">=</span> tail<span class="token punctuation">,</span> p <span class="token operator">=</span> t<span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> q <span class="token operator">=</span> p<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>q <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// p is last node 使用了CAS来保证线程安全</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>p<span class="token punctuation">.</span><span class="token function">casNext</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> newNode<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// Successful CAS is the linearization point</span>
                <span class="token comment">// for e to become an element of this queue,</span>
                <span class="token comment">// and for newNode to become "live".</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>p <span class="token operator">!=</span> t<span class="token punctuation">)</span> <span class="token comment">// hop two nodes at a time</span>
                    <span class="token function">casTail</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> newNode<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Failure is OK.</span>
                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// Lost CAS race to another thread; re-read next</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>p <span class="token operator">==</span> q<span class="token punctuation">)</span>
            <span class="token comment">// We have fallen off list.  If tail is unchanged, it</span>
            <span class="token comment">// will also be off-list, in which case we need to</span>
            <span class="token comment">// jump to head, from which all live nodes are always</span>
            <span class="token comment">// reachable.  Else the new tail is a better bet.</span>
            p <span class="token operator">=</span> <span class="token punctuation">(</span>t <span class="token operator">!=</span> <span class="token punctuation">(</span>t <span class="token operator">=</span> tail<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">?</span> t <span class="token operator">:</span> head<span class="token punctuation">;</span>
        <span class="token keyword">else</span>
            <span class="token comment">// Check for tail updates after two hops.</span>
            p <span class="token operator">=</span> <span class="token punctuation">(</span>p <span class="token operator">!=</span> t <span class="token operator">&amp;&amp;</span> t <span class="token operator">!=</span> <span class="token punctuation">(</span>t <span class="token operator">=</span> tail<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">?</span> t <span class="token operator">:</span> q<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如何选择使用自己的队列？</p>
<ul>
<li>边界</li>
<li>控件</li>
<li>吞吐量</li>
</ul>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结" aria-hidden="true">#</a> <strong>总结</strong></h3>
<p>java.util.concurrent包提供的容器，分为3类：</p>
<ul>
<li>
<p>Concurrent*</p>
<p>通过CAS实现并发</p>
</li>
<li>
<p>CopyOnWrite*</p>
<p>通过复制一份数据实现</p>
<p>ReentrantLock实现锁</p>
</li>
<li>
<p>Blocking*</p>
</li>
</ul>
<p>​		通过会用ReentrantLock实现，也就是AQS</p>
<h1 id="_8-控制并发流程" tabindex="-1"><a class="header-anchor" href="#_8-控制并发流程" aria-hidden="true">#</a> 8. 控制并发流程</h1>
<p>控制并发流程的工具类，作用就是帮我我们更容易让线程之间合作，让线程相互配合，来满足业务需求</p>
<table>
<thead>
<tr>
<th>类</th>
<th>作用</th>
<th>说明</th>
</tr>
</thead>
<tbody>
<tr>
<td>Semaphore</td>
<td>信号量，可以通过制作“许可证”的数量，来保证线程之间的配合</td>
<td>线程只有拿到了“许可证”后才能继续运行，相比于其他的同步器更加灵活</td>
</tr>
<tr>
<td>CyclicBarrier</td>
<td>线程会等待，直到足够多的线程达到了事先规定的数目，一旦达到触发条件就可以进行下一步动作</td>
<td>适用于线程之间相互等待处理结果就绪的场景</td>
</tr>
<tr>
<td>Phaser</td>
<td>和CyclicBarrier类似，但是计数是可变的</td>
<td>Java7才加入的</td>
</tr>
<tr>
<td>CountDownLatch</td>
<td>和CyclicBarrier类似，计数器递减到0时，才触发动作</td>
<td>不可重复使用</td>
</tr>
<tr>
<td>Exchanger</td>
<td>让两个所线程在合适时交换对象</td>
<td>使用场景： 当两个线程在同一个类的不同实例上时，用于交换数据</td>
</tr>
<tr>
<td>Condition</td>
<td>可以控制线程的“等待”和“唤醒”</td>
<td>是Object.wait()的升级版</td>
</tr>
</tbody>
</table>
<h2 id="_8-1-countdownlatch-倒计时门栓" tabindex="-1"><a class="header-anchor" href="#_8-1-countdownlatch-倒计时门栓" aria-hidden="true">#</a> 8.1 CountDownLatch 倒计时门栓</h2>
<p>自顶向下的CountDoanLatch，类似于一个门栓：“倒数门栓”</p>
<p>作用： 控制并发流程</p>
<p>例子： 购物拼团；大巴车，都是等待xx，然后干什么</p>
<p>流程：开始---&gt;进入等待---&gt;倒数结束---&gt;继续工作</p>
<p><strong>方法解释说明</strong></p>
<p>CountDownLatch(int count)：只有一个构造函数，参数count为需要倒数的数值</p>
<p>await(): 调用wait()方法的线程会被挂起，他会等待直到count的值为0才继续执行</p>
<p>countDown(): 将count的值减1，直到为0，等待的线程会被唤起</p>
<p><strong>作用示意图：</strong></p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115112226882.png" alt="image-20211115112226882"></p>
<p><strong>用法一</strong>: 一个线程等待多个线程都执行完毕，再继续自己的工作。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">CountDownLatch</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 工厂中，质检，5个工人检查，所有人都人为通过之后，工件才能进入下一个环节
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CountDownDemo1</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">CountDownLatch</span> countDownLatch <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ExecutorService</span> service <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">int</span> finalI <span class="token operator">=</span> i<span class="token punctuation">;</span>
           <span class="token class-name">Runnable</span> runnable <span class="token operator">=</span>  <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token annotation punctuation">@Override</span>
                <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token keyword">try</span> <span class="token punctuation">{</span>
                        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"No."</span> <span class="token operator">+</span> <span class="token punctuation">(</span>finalI <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 完成了检查"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span><span class="token keyword">finally</span> <span class="token punctuation">{</span>
                    	<span class="token comment">// 进行检查工作，让数量-1，一直减到0时，就进入resume，继续执行主线程</span>
                        countDownLatch<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">;</span>
            service<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span>runnable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"等待5个人检查完......"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        countDownLatch<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"所有人都完成了工作，进入下一个环节"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        service<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>只有当5个质检数据都完毕之后，主线程才会继续执行</p>
<p><strong>用法二</strong>：多个运动员在起跑线上，统一的等待发令员进行发令起跑</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">CountDownLatch</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 模拟100米跑步，运动员都准备好，等待指令员发指令
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CountDownDemo2</span> <span class="token punctuation">{</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>

        <span class="token class-name">CountDownLatch</span> countDownLatch <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">final</span> <span class="token keyword">int</span> no <span class="token operator">=</span> i<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token class-name">Runnable</span> runnable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
                <span class="token annotation punctuation">@Override</span>
                <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"No."</span> <span class="token operator">+</span> no <span class="token operator">+</span> <span class="token string">"准备完毕，等待发令枪"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">try</span> <span class="token punctuation">{</span>
                        countDownLatch<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"NO."</span> <span class="token operator">+</span> no <span class="token operator">+</span> <span class="token string">" 开始跑步了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">;</span>
            executorService<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span>runnable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 裁判员进行检查，准备发令</span>
        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发令枪响，比赛开始"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 进行发令</span>
        countDownLatch<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>当主线程将count设置为0的时候，线程池中的线程会同时执行</p>
<p><strong>注意:线程池的选择需要同时可以放入这么多个远动员，而不能进入阻塞队列，否则的话执行会有问题，有会排队现象</strong></p>
<p>扩展：</p>
<p>模拟100米跑步，运动员都准备好，等待指令员发指令终点需要等待5个远动员等到到了终点，然后统一结束</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">CountDownLatch</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">ExecutorService</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">Executors</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 模拟100米跑步，运动员都准备好，等待指令员发指令
 * 终点需要等待5个远动员等到到了终点，然后统一结束
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CountDownDemo2_1</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>

        <span class="token class-name">CountDownLatch</span> begin <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">CountDownLatch</span> end <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CountDownLatch</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ExecutorService</span> executorService <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">5</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">final</span> <span class="token keyword">int</span> no <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span>
            <span class="token class-name">Runnable</span> runnable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token annotation punctuation">@Override</span>
                <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"No."</span> <span class="token operator">+</span> no <span class="token operator">+</span> <span class="token string">"准备完毕，等待发令枪"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">try</span> <span class="token punctuation">{</span>
                        begin<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"NO."</span> <span class="token operator">+</span> no <span class="token operator">+</span> <span class="token string">" 开始跑步了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"No."</span> <span class="token operator">+</span> no <span class="token operator">+</span> <span class="token string">" 到终点了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                        end<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">;</span>
            executorService<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span>runnable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 裁判员进行检查，准备发令</span>
        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">5000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发令枪响，比赛开始"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 进行发令</span>
        begin<span class="token punctuation">.</span><span class="token function">countDown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        end<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"5位运动员都到达了终点"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        executorService<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意点： CountDownLatch是不能重用的，如果需要重新计数，可以考虑使用CycliBarrier或者创建新的CountDownLatch实例。</strong></p>
<p>只要是await通过之后，再次调用都是直接就放过了，是基本没有反应</p>
<p><strong>总结</strong>： 经典用法，一等多、多等一</p>
<p>CountDownLatch类在创建实例的时候，需要传递倒数次数。倒数到0的时候，之前等待的线程会继续运行</p>
<p>CountDownLathc是不能回滚重置的</p>
<h2 id="_8-2-semaphore-信号量" tabindex="-1"><a class="header-anchor" href="#_8-2-semaphore-信号量" aria-hidden="true">#</a> 8.2 Semaphore 信号量</h2>
<p>其实就是模拟了操作系统的信号量： <strong>主要用来限制或管理数量有限的资源的使用情况</strong></p>
<p>信号量的作用是维护一个<strong>许可证</strong>的计数，线程可以**”获取许可证“<strong>，那信号量的剩余许可证就减1，线程也可以</strong>”释放“**一个许可证，那么信号量剩余的许可证就加1，当信号量的许可证数量为0，那么下一个线程想要获取许可证的线程，就需要等待，直到有另外的线程释放了许可证.</p>
<p><strong>Semaphore信号量原理</strong></p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115144237037.png" alt="image-20211115144237037"></p>
<p>信号量使用流程</p>
<ol>
<li>初始化Semaphore并指定许可证数量</li>
<li>在需要被现在的代码前加acquire()或者acquireUninterruptibly()方法</li>
<li>在任务执行结束，调用release()来释放</li>
</ol>
<p>new Semaphore(int permits,boolean fair): 这里可以设置是否需要使用<strong>公平</strong>策略，如果传入true，那么Semaphore会把之前等待的线程加入FIFO的队列里，以便于当有了新的许可证，可以分发给之前等了最长时间的线程。false： 就可以插队</p>
<p>acquire(): 获取一个许可证，就进行阻塞</p>
<p>tryAcquire()： 获取一个许可证，没有就直接返回</p>
<p>acquireUninterruptibly()： 获取一个许可证，但是可以响应中断</p>
<p>tryAcquire(timeout):  获取一个许可证，在等待时间获取不到就返回</p>
<p>release()： 归还许可证</p>
<p><strong>特殊用法</strong>：</p>
<p>​	acquire(int permits): 是可以传递一个许可证的个数，如果一次性传递多个，那么释放也一定要注意释放多个</p>
<p>​	release(int permits): 一次性释放多个许可证</p>
<p><strong>注意点</strong>：</p>
<p>​	获取和释放的数量最好要一致，否则许可证会越来越少，直到线程卡死，因为许可证会越来越少。</p>
<p>​	注意在初始化Semaphore的时候设置<strong>公平性</strong>，一般为true会更合理</p>
<p>​	获取和释放许可证对线程是没有要求的，谁释放都可以</p>
<p>​	信号量的作用，除了控制临界区最多同时又N个线程访问外，另一个作用是可以实现<strong>条件等待</strong>，例如线程1需要在线程2完成准备工作之后在开始工作，那么就线程1进行acquire(),而线程而完成任务之后release(),这样的话，相当于实现了一个轻量级的CountDownLatch</p>
<p>​</p>
<h2 id="_8-3-condition接口-又称为条件对象" tabindex="-1"><a class="header-anchor" href="#_8-3-condition接口-又称为条件对象" aria-hidden="true">#</a> 8.3 Condition接口，又称为条件对象</h2>
<p>condition作用： 线程1需要等待某个条件的时候，它就去执行condition.await方法，一旦执行了await方法，线程就会进入阻塞状态。另外的线程需要去执行condition.signal()方法，这时JVM就会从被阻塞的线程里找，找到那些等待condition条件的线程，当线程收到了可执行号的时候，那么线程1就会退出阻塞状态，进入Runnable状态。</p>
<p>如下图所示：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115151130341.png" alt="image-20211115151130341"></p>
<p>signalAll方法会换气所有正在等在的线程</p>
<p>singal()是公平的，只会唤醒等待时间最长的线程</p>
<p>示例代码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">Condition</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">ReentrantLock</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 演示Condition的基本用法
 * 特点是绑定在锁上面的，ReentrantLock
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConditionDemo1</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token class-name">ReentrantLock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
	<span class="token comment">// 创建一个条件对象</span>
    <span class="token keyword">private</span> <span class="token class-name">Condition</span> condition <span class="token operator">=</span> lock<span class="token punctuation">.</span><span class="token function">newCondition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>


    <span class="token keyword">void</span> <span class="token function">meth1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span><span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程1条件不满足，开始await进入阻塞"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            condition<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程1条件满足了，开始执行后续任务"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">void</span> <span class="token function">meth2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span><span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程2，准备工作完成，唤醒其他线程"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            condition<span class="token punctuation">.</span><span class="token function">signal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token keyword">finally</span> <span class="token punctuation">{</span>
            lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">ConditionDemo1</span> demo1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConditionDemo1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程1进行调用条件，判断是否满足"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                demo1<span class="token punctuation">.</span><span class="token function">meth1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                demo1<span class="token punctuation">.</span><span class="token function">meth2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>生产者消费者模式：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">PriorityQueue</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">Condition</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">Lock</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">ReentrantLock</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 演示 使用Condition模拟生产者消费者
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConditionDemo2</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> queueSize <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">PriorityQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> queue <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PriorityQueue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>queueSize<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">Lock</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReentrantLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 队列没有满</span>
    <span class="token keyword">private</span> <span class="token class-name">Condition</span> notFull <span class="token operator">=</span> lock<span class="token punctuation">.</span><span class="token function">newCondition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 队列没有空</span>
    <span class="token keyword">private</span> <span class="token class-name">Condition</span> notEmpty <span class="token operator">=</span> lock<span class="token punctuation">.</span><span class="token function">newCondition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">class</span> <span class="token class-name">Consumer</span> <span class="token keyword">extends</span> <span class="token class-name">Thread</span> <span class="token punctuation">{</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">consume</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">consume</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token keyword">while</span> <span class="token punctuation">(</span>queue<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"队列为空，等待生产者数据"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token keyword">try</span> <span class="token punctuation">{</span>
                            notEmpty<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                    <span class="token comment">// 队列有数据，那么就拿出数据</span>
                    queue<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    notFull<span class="token punctuation">.</span><span class="token function">signalAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"从队列里取走了数据，队列还剩余:"</span> <span class="token operator">+</span> queue<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 个元素"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                    lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">class</span> <span class="token class-name">Producer</span> <span class="token keyword">extends</span> <span class="token class-name">Thread</span> <span class="token punctuation">{</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">produce</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">produce</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                lock<span class="token punctuation">.</span><span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token keyword">while</span> <span class="token punctuation">(</span>queue<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> queueSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"队列已经满了，通知消费者消费"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token keyword">try</span> <span class="token punctuation">{</span>
                            notFull<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                    <span class="token comment">// 队列有数据，那么就拿出数据</span>
                    queue<span class="token punctuation">.</span><span class="token function">offer</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    notEmpty<span class="token punctuation">.</span><span class="token function">signalAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"向队列插入了一个元素，还剩余："</span> <span class="token operator">+</span> <span class="token punctuation">(</span> queue<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span><span class="token string">" 个元素"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
                    lock<span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ConditionDemo2</span> demo <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConditionDemo2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Consumer</span> consumer <span class="token operator">=</span> demo<span class="token punctuation">.</span><span class="token keyword">new</span> <span class="token class-name">Consumer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Producer</span> producer <span class="token operator">=</span> demo<span class="token punctuation">.</span><span class="token keyword">new</span> <span class="token class-name">Producer</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        consumer<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        producer<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意点：</p>
<ol>
<li>实际上，如果说Lock用来替代synchronized，那么Condition就是用来替代Object.wait/notify的，所以在用法和性质上，几乎一样</li>
<li>await方法会自动释放持有的Lock锁，和Object.wait一样，不需要自己手动释放锁</li>
<li>调用await的时候，也必须持有锁，否则要抛出异常，和Object.wait一样</li>
</ol>
<p>优点： 主要是可以绑定多个锁对象</p>
<h2 id="_8-4-cyclicbarrier-循环栅栏" tabindex="-1"><a class="header-anchor" href="#_8-4-cyclicbarrier-循环栅栏" aria-hidden="true">#</a> 8.4 CyclicBarrier 循环栅栏</h2>
<p>CyclicBarrier循环栅栏和CountDownLatch很类似，都能阻塞一组线程</p>
<p>当有大量的线程相互配合，分别计算不同的任务，并且最后都要统一<strong>汇总</strong>，我们可以使用CyclicBarrier，CyclicBarrier可以构建一个集结点，直到所有的线程都到了集结点，那么该栅栏就会被撤销，所有的线程再统一出发，继续执行剩下的任务。</p>
<p>演示代码：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">BrokenBarrierException</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token class-name">CyclicBarrier</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 演示CyclicBarrier,课重用，比如说：5个人到了，就会继续执行任务，下5个又到了，还会继续执行任务
 * 
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CyclicbarrierDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">CyclicBarrier</span> cyclicBarrier <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CyclicBarrier</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 这里就是线程统一到达了之后，想要干什么</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"所有线程到场，开始执行统一任务"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Task</span> task <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Task</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> cyclicBarrier<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>task<span class="token punctuation">)</span><span class="token punctuation">;</span>
            thread<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Task</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span><span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token keyword">int</span> id<span class="token punctuation">;</span>
        <span class="token keyword">private</span> <span class="token class-name">CyclicBarrier</span> cyclicBarrier<span class="token punctuation">;</span>
        <span class="token keyword">public</span> <span class="token class-name">Task</span><span class="token punctuation">(</span><span class="token keyword">int</span> _id<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> _id<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">public</span> <span class="token class-name">Task</span><span class="token punctuation">(</span><span class="token keyword">int</span> _id<span class="token punctuation">,</span><span class="token class-name">CyclicBarrier</span> cy<span class="token punctuation">)</span><span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>id <span class="token operator">=</span> _id<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>cyclicBarrier <span class="token operator">=</span> cy<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程"</span> <span class="token operator">+</span> id<span class="token operator">+</span> <span class="token string">"开始出发"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10000</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"线程"</span> <span class="token operator">+</span> id <span class="token operator">+</span><span class="token string">" 到达了集结点"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    cyclicBarrier<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">BrokenBarrierException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>CyclicBarrier和CountDownLatch的区别</p>
<ul>
<li>作用不同： CyclicBarrier要等固定数量的线程到达了栅栏位置才能继续执行，而CountDownLatch只需要等count的数量为0，也就是说，CountDownLatch作用于事件，而CyclicBarrier作用于线程。</li>
<li>可重用行不同：CountDownLatch在倒数为0就触发闸门打开后，就不能再次使用了，除非新建新的实例，而CyclicBarrier可以重复使用。</li>
</ul>
<h1 id="_9-aqs" tabindex="-1"><a class="header-anchor" href="#_9-aqs" aria-hidden="true">#</a> 9. AQS</h1>
<p>AQS:  AbstractQueuedSynchronizer</p>
<p>AQS是一个用于构建锁，同步器、协同同居类的工具类（框架），有了AQS,更多的协同工具类都可以很方便的被写出来。</p>
<p><strong>AbstractQueuedSynchronizer是从JDK1.5加入的一个给予FIFO等待队列实现的一个用于实现同步器的基础框架。</strong></p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115162653752.png" alt="image-20211115162653752"></p>
<p>如果没有AQS，就需要每个协同工具自己实现：</p>
<ul>
<li>同步状态的原子性管理</li>
<li>线程的阻塞与解除阻塞</li>
<li>队列的管理</li>
</ul>
<p>AQS的最核心的三大部分：</p>
<p><strong>state状态</strong></p>
<p>会根据不同的是实现类的不同而不同，比如在Semaphore中，state表示<strong>剩余许可证的数量</strong>，在CountDownLatch中，表示<strong>剩余的倒数的数量</strong></p>
<p>state是volatile修饰的，会被并发的修改，所有的修改都需要保证<strong>线程安全</strong>，比如getState,setState、compareAndSetState操作来读取和更新这个状态，这些方法都依赖于j.u.c.atomic包的支持。</p>
<p>在ReentrantLock中，state表示<strong>锁</strong>的占用情况，包括<strong>可重入计数</strong>，当state为0的时候，表示Lock不被任何线程占有，表示锁是释放状态</p>
<p><strong>控制线程枪锁和配合的FIFO队列</strong></p>
<p>​	这个队列用来存放<strong>等待的线程</strong>，Aqs就是“排队管理器”，当多个线程同时争用一把锁时，必须有排队机制将那些没有获取到锁的线程串在一起，当锁释放时，排队管理器会挑选一个合适的线程来占有这个刚刚释放的锁。</p>
<p>​	AQS会维护一个等待的线程队列，把<strong>线程都放到这个队列中</strong></p>
<p>​	队列使用的是一个双向列表</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115163903630.png" alt="image-20211115163903630"></p>
<p>源代码如下图所示：</p>
<p><img src="https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20211115163835979.png" alt="image-20211115163835979"></p>
<p><strong>期望协同工具类去实现的获取/释放等重要方法</strong></p>
<p>​		这里的获取和释放方法，是利用AQS的协作工具类里最重要的方法，是由协作类自己去实现，而且含义各不相同。</p>
<p>​	<strong>获取方法：</strong></p>
<p>​			 获取方法依赖于state变量，经常会阻塞（比如获取不到锁的时候）</p>
<p>​			在Reentrant中，获取方法lock，作用就是重入次数，就是state+1</p>
<p>​			在Semaphore中，获取就是acquire方法，作用就是获取一个许可证</p>
<p>​			在CountDownLatch里面，获取就是await方法，作用就是<strong>等待，直到倒数结束</strong></p>
<p>​	 <strong>释放方法：</strong></p>
<p>​			在Reentrant中，释放方式就是unlock，作用就是释放锁，有重入就-1，没重入就释放</p>
<p>​			在Semaphore中，释放就是release，作用就是释放一个许可证</p>
<p>​			在CountDownLatch中，释放就是countDown，作用就是count减1</p>
<p>​</p>
<p>源码分析：</p>
<p>动手实现一个门栓</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span>locks<span class="token punctuation">.</span></span><span class="token class-name">AbstractQueuedSynchronizer</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-15
 * 模拟一个一次性门栓，当只要调用了一次countDown，就所有线程都放过
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OneShotLatch</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">Syncs</span> sync <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Syncs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 固定套路
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sync<span class="token punctuation">.</span><span class="token function">acquireShared</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 固定套路
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">signal</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        sync<span class="token punctuation">.</span><span class="token function">releaseShared</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>


    <span class="token doc-comment comment">/**
     * 相当于固定模板，根据独占锁和共享锁
     */</span>
    <span class="token keyword">private</span> <span class="token keyword">class</span> <span class="token class-name">Syncs</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractQueuedSynchronizer</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 自己控制的，什么时候加入到排队阻塞队列
         * <span class="token keyword">@param</span> <span class="token parameter">arg</span>
         * <span class="token keyword">@return</span>
         */</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">tryAcquireShared</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token function">getState</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/**
         * 判断是否唤醒线程
         * <span class="token keyword">@param</span> <span class="token parameter">arg</span>
         * <span class="token keyword">@return</span>
         */</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">protected</span> <span class="token keyword">boolean</span> <span class="token function">tryReleaseShared</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">setState</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">OneShotLatch</span> oneShotLatch <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">OneShotLatch</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token annotation punctuation">@Override</span>
                <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"尝试获取锁，获取失败就等待"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    oneShotLatch<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"开闸，"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"继续运行"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">5200</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        oneShotLatch<span class="token punctuation">.</span><span class="token function">signal</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Runnable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"尝试获取锁，获取失败就等待"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                oneShotLatch<span class="token punctuation">.</span><span class="token function">await</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"开闸，"</span> <span class="token operator">+</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"继续运行"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>注意： 编写AQS的线程协作器，基本都是有一定的套路</p>
<p>AQS补充材料（选修）</p>
<p>以下文章是关于AQS源码分析的，通常并不要求掌握，我找了一些优质学习资源，提供给小伙伴参考：</p>
<p>美团技术团队《从ReentrantLock的实现看AQS的原理及应用》：https://mp.weixin.qq.com/s/sA01gxC4EbgypCsQt5pVog</p>
<p>老钱《打通Java任督二脉——并发数据结构的基石》：https://juejin.im/post/5c11d6376fb9a049e82b6253HongJie《一行一行源码分析清楚AbstractQueuedSynchronizer》：https://javadoop.com/post/AbstractQueuedSynchronizer</p>
<p>爱吃鱼的KK《AbstractQueuedSynchronizer源码分析(基于Java 8)》：https://www.jianshu.com/p/e7659436538bwaterystone</p>
<p>《Java并发之AQS详解》：https://www.cnblogs.com/waterystone/p/4920797.html</p>
<p>英文论文的中文翻译：https://www.cnblogs.com/dennyzhangdd/p/7218510.htmlAQS</p>
<p>作者的英文论文：http://gee.cs.oswego.edu/dl/papers/aqs.pdf</p>
<h1 id="_10-获取子线程的执行结果" tabindex="-1"><a class="header-anchor" href="#_10-获取子线程的执行结果" aria-hidden="true">#</a> 10. 获取子线程的执行结果</h1>
<h2 id="future和callable-治理线程的第二大法宝" tabindex="-1"><a class="header-anchor" href="#future和callable-治理线程的第二大法宝" aria-hidden="true">#</a> Future和Callable--治理线程的第二大法宝</h2>
<h3 id="runnable的缺陷" tabindex="-1"><a class="header-anchor" href="#runnable的缺陷" aria-hidden="true">#</a> Runnable的缺陷</h3>
<pre><code>- 不支持返回值
- 也不能抛出checked Exception异常
</code></pre>
<p>为什么会这样设计？</p>
<p>​          run方法往上抛也是Thread类来接收，处理也不是我们来编写处理，所以抛出来我们也是无法处理</p>
<p>补救措施： 利用Callable接口</p>
<h3 id="callable接口" tabindex="-1"><a class="header-anchor" href="#callable接口" aria-hidden="true">#</a> Callable接口</h3>
<p>类似于Runnable，被其他线程所执行，但是有返回值和异常</p>
<p>我们可以使用Future.get来获取Callable接口返回的执行结果，还可以通过Future.isDone来判断任务是否已经执行完了，以及取消这个任务，限时获取任务的结果等。</p>
<p>在call()未执行完毕，调用get()的线程（假定此时是主线程）会被阻塞，直到call()方法返回了结果后，此时future.get()方法才会得到应有的结果，然后主线程才会切换到runnable状态</p>
<p><strong>总结</strong>： Future是一个存储器，它存储了call()这个任务的结果，而这个任务的执行时间是无法提前确定的，因为这完全取决于call()方法执行的情况。</p>
<p>实例如下：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Random</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-23 使用callable，future获取结果
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OneFuture</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ExecutionException</span><span class="token punctuation">,</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> service <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Future</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> submit <span class="token operator">=</span> service<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">CallableTask</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>submit<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        service<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">CallableTask</span> <span class="token keyword">implements</span> <span class="token class-name">Callable</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token class-name">Integer</span> <span class="token function">call</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Random</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span>concurrent<span class="token punctuation">.</span></span><span class="token operator">*</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-11-23 使用callable，future获取结果
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OneFutureDemo2</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">ExecutionException</span><span class="token punctuation">,</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token class-name">ExecutorService</span> service <span class="token operator">=</span> <span class="token class-name">Executors</span><span class="token punctuation">.</span><span class="token function">newFixedThreadPool</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Callable</span> callable <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Callable</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">Object</span> <span class="token function">call</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">;</span>
        <span class="token comment">// Callable callable = () -> new Random().nextInt();</span>
        <span class="token class-name">Future</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> submit <span class="token operator">=</span> service<span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span>callable<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>submit<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        service<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="future类" tabindex="-1"><a class="header-anchor" href="#future类" aria-hidden="true">#</a> Future类</h3>
<p>​	用法1： 线程池的submit方法返回Future对象</p>
<p>​	用法2： 用FutureTask来创建Future</p>
<h4 id="future主要方法" tabindex="-1"><a class="header-anchor" href="#future主要方法" aria-hidden="true">#</a> Future主要方法：</h4>
<p>​	1. get方法：获取结果，该行为取决于Callable的任务状态</p>
<pre><code>	1. 任务正常完成：get方法会立即返回
	1. 任务尚未完成（任务还未开始或进行中）：get将会阻塞并直到任务完成
	1. 任务执行过程中抛出Exception，get方法会抛出ExecutionException: 这里抛出异常，是call执行时产生的那个异常，这个类型是java.util.concurrent.ExecutionException,无论call执行是抛出的异常是什么，最后get方法抛出的异常都是ExecutionException
	1. 任务被取消：get方法会抛出CancellationException
	1. 任务超时：get有一个重载方法，是传一个延时时间，如果时间到了还没有结果，get方法会抛出TimeoutException异常。
</code></pre>
<ol start="2">
<li>
<p>get(long timeout,TimeUnit unit): 有超时的获取结果</p>
<ol start="3">
<li>cancel方法: 取消任务</li>
<li>isDone方法：判断线程是否执行完毕，执行完毕不代表成功或者失败，比如有中断等，只是返回这个任务被完事，不会再被执行了</li>
<li>isCancelled方法： 判断任务是否被取消</li>
</ol>
</li>
</ol>
</div></template>


