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
<p>非公平目的是为了提高效率，避免唤醒带�</p>
</div></template>


