<template><div><h1 id="java线程八大核心思想" tabindex="-1"><a class="header-anchor" href="#java线程八大核心思想" aria-hidden="true">#</a> Java线程八大核心思想</h1>
<p><a href="https://naotu.baidu.com/file/6211156d1e8c3da62fdcf57da0b5c97d" target="_blank" rel="noopener noreferrer">思维导图<ExternalLinkIcon/></a></p>
<h2 id="目录" tabindex="-1"><a class="header-anchor" href="#目录" aria-hidden="true">#</a> 目录：</h2>
<p>1 有多少种实现线程的方法？典型错误答案和正确答案（对应视频3-1~3-3、3-6）</p>
<p>2 实现Runnable接口和继承Thread类哪种方式更好？（对应视频3-2）</p>
<p>3 一个线程两次调用start()方法会出现什么情况？为什么？（对应视频4-2、4-5）</p>
<p>4 既然 start() 方法会调用 run() 方法，为什么我们选择调用 start() 方法，而不是直接调 用 run() 方法 2/92 呢？（对应视频4-5）</p>
<p>5 如何正确停止一个线程？（对应视频5-6、5-7、5-15）</p>
<p>6 如何处理不可中断的阻塞（例如抢锁时ReentrantLock.lock()或者Socket I/O时无法响 应中断，那应该 怎么让该线程停止呢？）（对应视频5-15）</p>
<p>7 线程有哪几种状态？生命周期是什么？（对应视频6-1、6-2、6-5）</p>
<p>8 如何用wait()实现两个线程交替打印 0~100 的奇偶数？（对应视频7-7）</p>
<p>9 如何用wait实现生产者模式？（对应视频7-6）</p>
<p>10 为什么wait必须在同步代码块中使用？（对应视频7-8）</p>
<p>11 为什么线程通信的方法wait(), notify()和notifyAll()被定义在Object类里？而sleep定义 在Thread类 里？（对应视频7-8）</p>
<p>12 wait方法是属于Object对象的，那调用Thread.wait会怎么样？（对应视频7-8）</p>
<p>13 如何选择用notify还是notifyAll？（对应视频7-3）</p>
<p>14 notifyAll之后所有的线程都会再次抢夺锁，如果某线程抢夺失败怎么办？（对应视频 7-8）</p>
<p>15 用suspend()和resume()来阻塞线程可以吗？为什么？（对应视频7-8）</p>
<p>16 wait/notify、sleep的异同（方法属于哪个对象？线程状态怎么切换？）（对应视频7- 11）</p>
<p>17 在join期间，线程处于哪种线程状态？（对应视频7-13）</p>
<p>18 yield和sleep区别？（对应视频7-15）</p>
<p>19 守护线程和普通线程的区别？（对应视频8-3）</p>
<p>20 我们是否需要给线程设置为守护线程？（对应视频8-3）</p>
<p>21 为什么程序设计不应依赖于线程优先级？（对应视频8-4）</p>
<p>22 讲讲Java异常体系？（对应视频5-9）</p>
<p>23 实际工作中，如何全局处理异常？（对应视频9-3）</p>
<p>24 为什么异常需要全局处理？不处理行不行？（对应视频9-3）</p>
<p>25 run方法是否可以抛出异常？如果抛出异常，线程的状态会怎么样？（对应视频9-1） 3/92</p>
<p>26 一共有哪几类线程安全问题？（对应视频10-3、10-6~10-12）</p>
<p>27 哪些场景需要额外注意线程安全问题？（对应视频10-13）</p>
<p>28 为什么多线程会带来性能问题？（对应视频10-14）</p>
<p>29 什么是多线程的上下文切换？（对应视频10-14）</p>
<p>30 Java代码如何一步步转化，最终被CPU执行？（对应视频12-3）</p>
<p>31 单例模式的作用和适用场景（对应视频13-9~13-13）</p>
<p>32 重排序的实例：单例模式多种写法、单例和高并发的关系（重要，真实面试高频考 题，我遇到了 不止一次了，重点讲双重检查模式的volatile）（对应视频13-11） 33 单例各种写法的适用场合（对应视频13-13）</p>
<p>34 饿汉式的缺点？（对应视频13-13）</p>
<p>35 懒汉式的缺点？（对应视频13-13）</p>
<p>36 为什么要用double-check？不用就不安全吗？（对应视频13-11）</p>
<p>37 为什么双重检查模式要用volatile？（对应视频13-11）</p>
<p>38 应该如何选择，用哪种单例的实现方案最好？（对应视频13-13）</p>
<p>39 讲一讲什么是Java内存模型？（对应视频第12、13章）</p>
<p>40 什么是happens-before？（对应视频12-13~12-15）</p>
<p>41 Happens-Before规则有哪些？（对应视频12-14）</p>
<p>42 讲讲volatile关键字？（对应视频13-1~13-5）</p>
<p>43 volatile和synchronized的异同？（对应视频13-5）</p>
<p>44 什么是内存可见性问题？（对应视频12-9~12-11）</p>
<p>45 主内存和本地内存的关系（对应视频12-12）</p>
<p>46 什么是原子操作？（对应视频13-7）</p>
<p>47 Java中的原子操作有哪些？（对应视频13-7）</p>
<p>48 long 和 double 的原子性你了解吗？（对应视频13-8）</p>
<p>49 生成对象的过程是不是原子操作？（对应视频13-11） 4/92</p>
<p>50 写一个必然死锁的例子？（对应视频14-5）</p>
<p>51 生产中什么场景下会发生死锁？（对应视频14-6、14-7）</p>
<p>52 发生死锁必须满足哪些条件？（对应视频14-8）</p>
<p>53 如何用工具定位死锁？（对应视频14-9、14-10）</p>
<p>54 有哪些解决死锁问题的策略？（对应视频14-11~14-15）</p>
<p>55 讲一讲经典的哲学家就餐问题？（经典名称叫刀叉问题、吃面问题）（对应视频14- 12~14-14）</p>
<p>56 实际开发中如何避免死锁？（对应视频14-16、14-17）</p>
<p>57 什么是活跃性问题？活锁、饥饿和死锁有什么区别？（对应视频14-18~14-21）</p>
<p>面试题正文：</p>
<h2 id="_1-有多少种实现线程的方法-典型错误答案和正确答案-对应视频3-1-3-3、3-6" tabindex="-1"><a class="header-anchor" href="#_1-有多少种实现线程的方法-典型错误答案和正确答案-对应视频3-1-3-3、3-6" aria-hidden="true">#</a> 1. 有多少种实现线程的方法？典型错误答案和正确答案（对应视频3-1~3-3、3-6）   ？</h2>
<p>解题思路，一下5点：</p>
<ol>
<li>
<p>从不同的角度看，会有不同的答案。</p>
</li>
<li>
<p>典型答案是两种，分别是实现Runnable接口和继承Thread类，然后具体展开说；</p>
</li>
<li>
<p>但是，我们看原理，其实Thread类实现了Runnable接口，并且看Thread类的run方法，会发现其 实那两种本质都是一样的，run方法的代码如下：</p>
<div class="language-@Override ext-@Override line-numbers-mode"><pre v-pre class="language-@Override"><code>public void run() {

    if (target != null) {

        target.run();

    }

}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<p>方法一和方法二，也就是实现“Runnable接口并传入Thread类”和继承“Thread类然后重写run()”在实现多线程的本质上，并没有任何区别，都是最终调用了start()方法来进行新建线程。这两个方法的最主要区别是在于run()方法的内容来源：</p>
<p>方法一： 最终调用target.run();</p>
<p>方法二： run()整个方法被重写；</p>
<ol start="4">
<li>然后具体展开说其他方式： 还有其他的实现线程的方法，例如线程池，定时器，他们也能够创建线程，但是也没有逃脱本质，都是使用Runnable接口和继承Thread类的方式。</li>
<li>结论： 我们只能通过新建Thread类的方式来创建线程，但是类里面的run方法有两种方式来实现，一种是重写run方法，一种是实现Runnable接口的run方法，然后把该runnable实例传递给Thread类。除此之外，从表面上看线程池、定时器等工具类也可以创建线程，但是他们的本质都逃不出刚才所说的范围。</li>
</ol>
<h2 id="_2-实现runnable接口和继承thread类哪种方式更好-对应视频3-2" tabindex="-1"><a class="header-anchor" href="#_2-实现runnable接口和继承thread类哪种方式更好-对应视频3-2" aria-hidden="true">#</a> 2. 实现Runnable接口和继承Thread类哪种方式更好？（对应视频3-2）</h2>
<ol>
<li>
<p>实现Runnable接口方式更好，继承Thread类不推荐，理由如下：</p>
<p>a. 从代码架构的角度，具体的任务(run方法)应该和“创建和运行线程的机制（Thread类）”进行解耦。</p>
<p>b. 使用Thread类的方式的话，那么每次创建一个任务，只能新建一个独立的线程，而这样做的损耗会比较大。如果使用Runnable创建，那么会大大减少损耗。</p>
<p>c. 继承Thread类以后，由于Java语言不支持双继承，这样就无法再继承其他的类，限制了可扩展 性。</p>
</li>
<li>
<p>两种方式的本质对比</p>
<p>方法一和方法二，也就是 “实现Runnable接口并传入Thread类”和“继承Thread类然后重写run*()<em>” 在实现多线程的本质上，并没有区别，都是最终调用了start</em>()<em>方法来新建线程。这两个方法的最主 要区别在于run</em>()*方法的内容来源：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>target <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        target<span class="token punctuation">.</span>run<span class="token operator">*</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token punctuation">}</span>

<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>方法一： 最终调用target.run();</p>
<p>方法二： run()整个被重写;</p>
</li>
</ol>
<h2 id="_3-一个线程两次调用start-方法会出现什么情况-为什么-对应视频4-2、4-5" tabindex="-1"><a class="header-anchor" href="#_3-一个线程两次调用start-方法会出现什么情况-为什么-对应视频4-2、4-5" aria-hidden="true">#</a> 3. 一个线程两次调用start*()*方法会出现什么情况？为什么？（对应视频4-2、4-5）</h2>
<p>我们查询start()的源码可得知：</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token doc-comment comment">/**
         * This method is not invoked for the main method thread or "system"
         * group threads created/set up by the VM. Any new functionality added
         * to this method in the future may have to also be added to the VM.
         *
         * A zero status value corresponds to state "NEW".
         */</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>threadStatus <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span>
            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalThreadStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">/* Notify the group that this thread is about to be started
         * so that it can be added to the group's list of threads
         * and the group's unstarted count can be decremented. */</span>
        group<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">boolean</span> started <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token function">start0</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            started <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>started<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    group<span class="token punctuation">.</span><span class="token function">threadStartFailed</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> ignore<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">/* do nothing. If start0 threw a Throwable then
                  it will be passed up the call stack */</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>流程如下：</p>
<ol>
<li>检查线程状态，如果线程状态不为NEW状态的话，将会抛出 “IllegalThreadStateException”异常，在运行中或者已经结束的线程，都无法再次启动。</li>
</ol>
<p>流程:</p>
<ol start="2">
<li>
<p>被加入线程组</p>
</li>
<li>
<p>调用start0()方法启动线程</p>
<p>注意：</p>
<ol>
<li>start方法是被synachronized修饰，可以保证线程安全启动。</li>
<li>由JVM创建的man方法和system组线程，并不会通过start来启动。</li>
</ol>
<p>回答： 从源码可以看出，start的时候会先检查线程状态，只有在NEW状态下才会继续执行，否则抛出异常。</p>
</li>
</ol>
<h2 id="_4-既然-start-方法会调用-run-方法-为什么我们选择调用-start-方法-而不是直接调用-run-方法呢-对应视频4-5" tabindex="-1"><a class="header-anchor" href="#_4-既然-start-方法会调用-run-方法-为什么我们选择调用-start-方法-而不是直接调用-run-方法呢-对应视频4-5" aria-hidden="true">#</a> 4 既然 start()方法会调用 run*()* 方法，为什么我们选择调用 start*()* 方法，而不是直接调用 run() 方法呢？（对应视频4-5）</h2>
<p>start()方法才会真正的启动一个线程，run()方法就是一个普通方法，和线程相关的生命周期并没有任何关系.</p>
<h2 id="_5-如何正确停止一个线程-对应视频5-6、5-7、5-15" tabindex="-1"><a class="header-anchor" href="#_5-如何正确停止一个线程-对应视频5-6、5-7、5-15" aria-hidden="true">#</a> 5 如何正确停止一个线程？（对应视频5-6、5-7、5-15）</h2>
<ol>
<li>
<p>原理： 使用innterupt中断来请求停止线程，而不是强制停止，这样的好处是安全的停止线程。</p>
</li>
<li>
<p>三方配合： 想要停止线程，要请求放，被停止方，子方法被调用方相互配合才行。</p>
</li>
<li>
<p>作为被停止方，每次循环中或者适时检查中断信号，并且在可能抛出InterrupedException的方法处理该中断信号。</p>
</li>
<li>
<p>请求方： 发出中断信号。</p>
</li>
<li>
<p>子方法调用方（被线程调用的方法）要注意：优先在方法层免抛出IntteruedExcaption,或检查中断信号时，再次设置中断信号。</p>
<p><strong>错误的停止方法： stop/suspend方法已经被废弃，volatile的boolean方式无法处理长时间阻塞的情况。</strong></p>
</li>
</ol>
<h2 id="_6-如何处理不可中断的阻塞-例如抢锁时reentrantlock-lock-或者socket-i-o时无法响应中断-那-应该怎么让该线程停止呢-对应视频5-15" tabindex="-1"><a class="header-anchor" href="#_6-如何处理不可中断的阻塞-例如抢锁时reentrantlock-lock-或者socket-i-o时无法响应中断-那-应该怎么让该线程停止呢-对应视频5-15" aria-hidden="true">#</a> *<em>6 如何处理不可中断的阻塞（例如抢锁时ReentrantLock.lock</em>()*或者Socket I/O时无法响应中断，那 应该怎么让该线程停止呢？）（对应视频5-15） **</h2>
<p>如果线程阻塞是由于调用了 wait*()<em>，sleep</em>()* 或 join*()* 方法，你可以中断线程，通过抛出 InterruptedException 异常来唤醒该线程。</p>
<p>但是对于不能响应InterruptedException的阻塞，很遗憾，并没有一个通用的解决方案。 但是我们可以利用特定的其它的可以响应中断的方法，比如ReentrantLock.lockInterruptibly*()*， 比如关闭套接字使线程立即返回等方法来达到目的。 答案有很多种，因为有很多原因会造成线程阻塞，所以针对不同情况，唤起的方法也不同。</p>
<p><strong>总结就是说如果不支持响应中断，就要用特定方法来唤起，没有万能药。</strong></p>
<h2 id="_7-线程有哪几种状态-生命周期是什么-对应视频6-1、6-2、6-5" tabindex="-1"><a class="header-anchor" href="#_7-线程有哪几种状态-生命周期是什么-对应视频6-1、6-2、6-5" aria-hidden="true">#</a> **7 线程有哪几种状态？生命周期是什么？（对应视频6-1、6-2、6-5）   **</h2>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201040490.png" alt="image-20211012114330991-16346333160091"></p>
<p>图中三点需要明确： 状态、路径、转换条件。</p>
<ol>
<li>
<p>6种状态，NEW、RUNNABLE、BLOCKED、WAITING、TIME_WAITING、TERMINATED</p>
</li>
<li>
<p>特殊情况：</p>
<p>如果发生异常，可以直接跳到终止情况，不必在遵循路径，比如可以直接从WAITING跳到TERMINATED。</p>
<p>从Object.wait()刚被唤醒时，通常不会立刻去状态monitor锁，那就会从waiting进入blocked状态，然后在转换到runnable状态</p>
<p>线程的官方文档如下：</p>
<p>https://docs.oracle.com/javase/8/docs/api/index.html?java/lang/Thread.State.html</p>
</li>
</ol>
<h2 id="_8-如何用wait-实现两个线程交替打印-0-100-的奇偶数-对应视频7-7" tabindex="-1"><a class="header-anchor" href="#_8-如何用wait-实现两个线程交替打印-0-100-的奇偶数-对应视频7-7" aria-hidden="true">#</a> 8 如何用wait*()*实现两个线程交替打印 0~100 的奇偶数？（对应视频7-7）</h2>
<p>两个线程，一个打印奇数，一个打印偶数，交替输出，如下所示：</p>
<p>偶线程：0</p>
<p>奇线程：1</p>
<p>偶线程：2</p>
<p>........</p>
<p>奇线程：99</p>
<p>偶线程：100</p>
<p>解题思路：</p>
<ol>
<li>
<p>使用synchronized实现</p>
<p>比较容易想的一个方案是，要输出的时候判断一下当前需要输出的数是不是自己要负责打印的值，如 果是就输出，不是就直接释放锁。 这个方法可以满足题目的要求：两个线程，一个打印奇数，一个打印偶数，轮流输出。但只是用了一 个讨巧的方式避开了线程交替获取锁的需求，明显没有答到面试官想考察的考点上。而且效率较低， 如果同一个线程一直抢到锁，而另一个线程一直没有拿到，就会导致线程做很多无谓的空转。那么有 没有更好的解决方案，让两个线程严格地交替获取到锁呢？ 代码详见git下载区的WaitNotifyPrintOddEvenSyn类</p>
<p>注意：这里的synchronized锁对象不应该用count变量，因为该变量执行了count++之后，count所指 向的对象地址已经变了，详见问答区：</p>
<p>https://coding.imooc.com/learn/questiondetail/137392.html</p>
<p>扩展阅读： synchronized期间锁对象不应该改变：</p>
<p>https://stackoverflow.com/questions/6711838/synchronizing-on-an-object-in-java-thenchanging-the-value-of-the-synchronized</p>
</li>
<li>
<p>更好的方式： wait/notify</p>
<p>这种实现方式的原理就是线程1打印之后唤醒线程2，然后让出锁，自己进入休眠 状态。因为进入了休眠状态就不会与线程2抢锁，此时只有线程2在获取锁，所以线程2必然会拿到 锁。线程2以同样的逻辑执行，唤醒线程1并让出自己持有的锁，自己进入休眠状态。这样来来回回， 持续执行直到任务完。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 两个线程交替打印奇偶数
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestJOS</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> lock <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">int</span> count <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">TurningRunner</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;=</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">":"</span> <span class="token operator">+</span> count<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token comment">// 唤醒其余线程</span>
                    lock<span class="token punctuation">.</span><span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;=</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token keyword">try</span> <span class="token punctuation">{</span>
                            <span class="token comment">// 如果还是小于100，说明自己还需要休眠，否则就进行结束，没有这个if判断，那么交替打印完毕之后线程将不会结束</span>
                            lock<span class="token punctuation">.</span><span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token punctuation">}</span>
                    <span class="token punctuation">}</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TurningRunner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"偶数"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TurningRunner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"奇数"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ol>
<h2 id="_9-如何用wait实现生产者模式-对应视频7-6" tabindex="-1"><a class="header-anchor" href="#_9-如何用wait实现生产者模式-对应视频7-6" aria-hidden="true">#</a> <strong>9 如何用wait实现生产者模式？（对应视频7-6）</strong></h2>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">LinkedList</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Random</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-18
 * 生产者消费者
 * 处理数据的时候需要使用同一个对象，那么就需要借助一个类来让消费者生产者同时是抢夺一把锁或者传递一个共同的对象去进行锁控制
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ProductConsumerDemo</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">EventStorage</span> eventStorage <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EventStorage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Producter</span> producter <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Producter</span><span class="token punctuation">(</span>eventStorage<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Consumer</span> consumer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Consumer</span><span class="token punctuation">(</span>eventStorage<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> pt <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>producter<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> ct <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>consumer<span class="token punctuation">)</span><span class="token punctuation">;</span>
        pt<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        ct<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Producter</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>

        <span class="token class-name">EventStorage</span> storage <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Producter</span><span class="token punctuation">(</span><span class="token class-name">EventStorage</span> eventStorage<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            storage <span class="token operator">=</span> eventStorage<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                storage<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Consumer</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token class-name">EventStorage</span> storage <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Consumer</span><span class="token punctuation">(</span><span class="token class-name">EventStorage</span> eventStorage<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            storage <span class="token operator">=</span> eventStorage<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                storage<span class="token punctuation">.</span><span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>


<span class="token keyword">class</span> <span class="token class-name">EventStorage</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">int</span> maxSize<span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Date</span><span class="token punctuation">></span></span> storage<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">EventStorage</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        maxSize <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>
        storage <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">put</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>storage<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> maxSize<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        storage<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Date</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"仓库里面有了 "</span> <span class="token operator">+</span> storage<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 个数据"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">void</span> <span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>storage<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        storage<span class="token punctuation">.</span><span class="token function">poll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"仓库里面移出一个数据，还剩余 "</span> <span class="token operator">+</span> storage<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 个数据！"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-为什么wait必须在同步代码块中使用-对应视频7-8" tabindex="-1"><a class="header-anchor" href="#_10-为什么wait必须在同步代码块中使用-对应视频7-8" aria-hidden="true">#</a> **10 为什么wait必须在同步代码块中使用？（对应视频7-8）   **</h2>
<p>引用经典回答：</p>
<p>Let's look at an example of what issues we would run into if <code v-pre>wait()</code> could be called outside of a synchronized block.</p>
<p>Suppose we were to implement a blocking queue.</p>
<p>A first attempt (without synchronization) could look something along the lines below</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">BlockingQueue</span> <span class="token punctuation">{</span>
    <span class="token class-name">Queue</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> buffer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LinkedList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">give</span><span class="token punctuation">(</span><span class="token class-name">String</span> data<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        buffer<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token function">notify</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Since someone may be waiting in take</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">take</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>buffer<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>  <span class="token comment">// Avoid "if" due to spurious wakeups</span>
            <span class="token function">wait</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> buffer<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>那么可能发生如下错误：</p>
<ol>
<li>
<p>消费者线程调用了take方法并发看到了buffer.isEmpty().</p>
</li>
<li>
<p>在消费者线程中继续wait()之前，生产者线程刚刚调用完一个完成的give(),也就是bugger.add(data)和notify();</p>
</li>
<li>
<p>消费者线程现在调用wait(),但是完美的错过了刚才的notify();</p>
</li>
<li>
<p>如果运气不佳，即使有可用的数据、但是没有更多的生产者的话，那么消费者就会陷入到无限期的wait()当中。</p>
<p><strong>一旦理解了这个问题，解决方案就是使用了synchronized来保证notify永远不会在isEmpty和wait方法之间被调用到。</strong></p>
<p>参考资料：</p>
<p>https://programming.guide/java/why-wait-must-be-in-synchronized.html</p>
</li>
</ol>
<h2 id="_11-为什么线程通信的方法wait-notify-和notifyall-被定义在object类里-而sleep定义在-thread类里-对应视频7-8" tabindex="-1"><a class="header-anchor" href="#_11-为什么线程通信的方法wait-notify-和notifyall-被定义在object类里-而sleep定义在-thread类里-对应视频7-8" aria-hidden="true">#</a> *<em>11 为什么线程通信的方法wait</em>()<em>, notify</em>()<em>和notifyAll</em>()*被定义在Object类里？而sleep定义在 Thread类里？（对应视频7-8）   **</h2>
<p>引用经典回答：</p>
<p>https://www.java67.com/2012/09/top-10-tough-core-java-interview-questions-answers.html</p>
<p>https://javarevisited.blogspot.com/2012/02/why-wait-notify-and-notifyall-is.html#axzz75Zablz7P</p>
<p>wait,notify,notifyAll定义在Object对象中的原因：JAVA提供的锁是对象级的而不是线程级的，每个对象都有个锁，而线程是可以获得这个对象的。因此线程需要等待某些锁，那么只要调用对象中的wait()方法便可以了。而wait()方法如果定义在Thread类中的话，那么线程正在等待的是哪个锁就不明确了。这也就是说wait，notify和notifyAll都是锁级别的操作，所以把他们定义在Object类中是因为锁是属于对象的原因。</p>
<p>sleep的作用是： 让该线程进行持续获取cpu资源，其他线程不要进行打断，所以能明确sleep是属于线程级别，是为了让线程在限定的时间后去执行，而且sleep方法不会释放锁。</p>
<p>注意： 如果wait不在同步方法中调用，就会抛出java.lang.IllegMonitorStateExceptionyi异常。</p>
<h2 id="_12-wait方法是属于object对象的-那调用thread-wait会怎么样-对应视频7-8" tabindex="-1"><a class="header-anchor" href="#_12-wait方法是属于object对象的-那调用thread-wait会怎么样-对应视频7-8" aria-hidden="true">#</a> 12 wait方法是属于Object对象的，那调用Thread.wait会怎么样？（对应视频7-8）</h2>
<p>这里就把Thread当成一个普通的类，和Object没有任何区别。</p>
<p>但是这样会存在一个问题，那就是线程退出的时候会自动调用notify()方法，是在底层c++代码中体现。这样会让我们设计的唤醒流程受到极大的干扰，所以十分不推荐调用Thread类的wait()方法。</p>
<h2 id="_13-如何选择用notify还是notifyall-对应视频7-3" tabindex="-1"><a class="header-anchor" href="#_13-如何选择用notify还是notifyall-对应视频7-3" aria-hidden="true">#</a> 13 如何选择用notify还是notifyAll？（对应视频7-3）</h2>
<p>Object.notify()可能导致信号丢失这样的正确性问题，而Object.notifyAll()虽然效率不太高（把不需要唤醒的线程都给唤醒了）,但是这样对正确性方面有保证。因此实现通知的一种比较流行的保守性方法是优先使用Object.notifyAll()方法以保证正确性，只有在有证据表明使用Object.notify()正确的情况下才使用notify()，notify()只有在下列条件全部满足的情况下才能够用于替代notifyAll方法。</p>
<p>条件1： 一次通知仅需要唤醒最多一个线程，在不同等待线程可能使用不同的保护条件的情况下，Object.notify()方法唤醒的一个任意线程可能不是我们需要唤醒的那一个线程，因此，这个问题还需要满足条件2来排除.</p>
<p>条件2： 相应对象的等待集中仅包含同质等待线程。所谓的同质等待线程是指使用同一个保护条件，并且这些线程在Object.wait()调用返回之后的处理逻辑一致。最为典型的同质等待线程是使用同一个Runnable接口实例创建的不同线程或者从同一个Thread子类的new出来的多个实例。</p>
<p>注意： Object.notify()唤醒的是其所属对象上的任意等待线程。Object.notify()本身在唤醒线程的时候是不考虑保护条件的。Object.notifyAll()方法唤醒的是其所属对象上的所有等待线程。使用Object.notify替代notifyAll时需要确保以下两个条件得以同时满足：</p>
<p>. 一次通知仅需要唤醒至多一个线程</p>
<p>. 相应对象上的所有等待线程都是同质等待线程</p>
<h2 id="_14-notifyall之后所有的线程都会再次抢夺锁-如果某线程抢夺失败怎么办-对应视频7-8" tabindex="-1"><a class="header-anchor" href="#_14-notifyall之后所有的线程都会再次抢夺锁-如果某线程抢夺失败怎么办-对应视频7-8" aria-hidden="true">#</a> 14 notifyAll之后所有的线程都会再次抢夺锁，如果某线程抢夺失败怎么办？（对应视频7-8）</h2>
<p>继续等待，不会有其他的动作，就和等待synchronized的monitor一样。</p>
<h2 id="_15-用suspend-和resume-来阻塞线程可以吗-为什么-对应视频7-8" tabindex="-1"><a class="header-anchor" href="#_15-用suspend-和resume-来阻塞线程可以吗-为什么-对应视频7-8" aria-hidden="true">#</a> *<em>15 用suspend</em>()<em>和resume</em>()*来阻塞线程可以吗？为什么？（对应视频7-8）   **</h2>
<p>​		suspend和resume已经废弃，功能类似于wait/notify，但是不会释放锁，很容易引起死锁。</p>
<h2 id="_16-wait-notify、sleep的异同-方法属于哪个对象-线程状态怎么切换-对应视频7-11" tabindex="-1"><a class="header-anchor" href="#_16-wait-notify、sleep的异同-方法属于哪个对象-线程状态怎么切换-对应视频7-11" aria-hidden="true">#</a> <strong>16 wait/notify、sleep的异同（方法属于哪个对象？线程状态怎么切换？）（对应视频7-11）</strong></h2>
<p>wait/notify方法属于Object</p>
<p>sleep方法属于Thread</p>
<p>相同：</p>
<ol>
<li>wait/sleep都可以使线程阻塞，对应的线程状态是waiting和Time_waiting.</li>
<li>wait和sleep方法都可以响应Thread.interrupt中断信号</li>
</ol>
<p>不同：</p>
<pre><code>1. wait方法必须在同步方法中，而sleep不需要
2. 在同步方法中执行sleep时，不会释放monitor锁，但是wait会释放monitor锁。
3. 对象所属不一样，wait、notify、notifyAll属于Object，sleep属于Thread
</code></pre>
<h2 id="_17-在join期间-线程处于哪种线程状态-对应视频7-13" tabindex="-1"><a class="header-anchor" href="#_17-在join期间-线程处于哪种线程状态-对应视频7-13" aria-hidden="true">#</a> <strong>17</strong> **在join期间，线程处于哪种线程状态？（对应视频7-13） **</h2>
<p>join的作用：让父线程等待子线程结束之后才能继续运行。</p>
<p>java描述：当我们调用某个线程的这个方法时，这个方法会挂起调用线程，直到被调用线程结束执行，调用线程才会继续执行</p>
<p>处于waiting状态，为什么不是time_waiting状态呢？是因为time_waiting状态不知道结束时间。</p>
<h2 id="_18-yield和sleep区别-对应视频7-15" tabindex="-1"><a class="header-anchor" href="#_18-yield和sleep区别-对应视频7-15" aria-hidden="true">#</a> **18 yield和sleep区别？（对应视频7-15）   **</h2>
<p>区别： sleep期间线程调度器不会去调度该线程，而yield方法只是让线程释放出自己的cpu时间片，线程依旧处于就绪状态，随时都可以被再次调度。</p>
<h2 id="_19-守护线程和普通线程的区别-对应视频8-3" tabindex="-1"><a class="header-anchor" href="#_19-守护线程和普通线程的区别-对应视频8-3" aria-hidden="true">#</a> **19 守护线程和普通线程的区别？（对应视频8-3）   **</h2>
<p>​	守护线程： 在没有用户线程可以服务时会自动离开。</p>
<p>​	唯一的不同之处在于是否影响虚拟机的离开，普通线程影响，守护线程不影响。</p>
<h2 id="_20-我们是否需要给线程设置为守护线程-对应视频8-3" tabindex="-1"><a class="header-anchor" href="#_20-我们是否需要给线程设置为守护线程-对应视频8-3" aria-hidden="true">#</a> **20 我们是否需要给线程设置为守护线程？（对应视频8-3）   **</h2>
<p>我们通常不需要设置守护线程，因为设置守护线程很危险。比如线程正在访问文件、数据库的时候，所有用户线程都结束了，那么守护线程就必定会在某个时间点结束。</p>
<p>https://blog.csdn.net/liuxiao723846/article/details/48467803</p>
<h2 id="_21-为什么程序设计不应依赖于线程优先级-对应视频8-4" tabindex="-1"><a class="header-anchor" href="#_21-为什么程序设计不应依赖于线程优先级-对应视频8-4" aria-hidden="true">#</a> **21 为什么程序设计不应依赖于线程优先级？（对应视频8-4）   **</h2>
<p>由于优先级是由线程调度器来控制的，所以优先级高的并不能保证就一定比优先级低的先运行，并且如果优先级设置得不合理，可能导致线程饥饿等问题（线程优先级低的一直得不到运行）。通俗点就是各个平台的线程调度方案不一致（linux,windows,mos）等。</p>
<h2 id="_22-讲讲java异常体系-对应视频5-9" tabindex="-1"><a class="header-anchor" href="#_22-讲讲java异常体系-对应视频5-9" aria-hidden="true">#</a> **22 讲讲Java异常体系？（对应视频5-9）   **</h2>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201040647.png" alt="image-20211012153641022-16346333269592"></p>
<h2 id="_23-实际工作中-如何全局处理异常-对应视频9-3" tabindex="-1"><a class="header-anchor" href="#_23-实际工作中-如何全局处理异常-对应视频9-3" aria-hidden="true">#</a> **23 实际工作中，如何全局处理异常？（对应视频9-3）   **</h2>
<ol>
<li>
<p>给程序统一设置</p>
<p>先自己实现UncaughtExceptionHandler接口，在uncaughtExcaption(Thread t,Throwable e)的实现上，根据业务需要不同的策略，最为常见的方式是把错误信息写入日志，或者重启线程、或者执行其他的修复和诊断。</p>
</li>
<li>
<p>给每个线程和线程池单独设置</p>
</li>
</ol>
<p>如果业务需要特殊处理，我们也可以给某个线程或者线程池指定单独的UncaughtExceptionHandler。</p>
<h2 id="_24-为什么异常需要全局处理-不处理行不行-对应视频9-3" tabindex="-1"><a class="header-anchor" href="#_24-为什么异常需要全局处理-不处理行不行-对应视频9-3" aria-hidden="true">#</a> **24 为什么异常需要全局处理？不处理行不行？（对应视频9-3）   **</h2>
<p>不处理不行，因为不处理必定将报错信息抛到前端，这样会存在信息泄露，不安全。只要是未处理的异常，我们都应该返回一个通用的提示语即可。</p>
<h2 id="_25-run方法是否可以抛出异常-如果抛出异常-线程的状态会怎么样-对应视频9-1" tabindex="-1"><a class="header-anchor" href="#_25-run方法是否可以抛出异常-如果抛出异常-线程的状态会怎么样-对应视频9-1" aria-hidden="true">#</a> **25 run方法是否可以抛出异常？如果抛出异常，线程的状态会怎么样？（对应视频9-1）   **</h2>
<p>run方法不能抛出异常，如果运行时发生错误，线程会停止运行，进入terminated状态。</p>
<p>因为继承的Thread或者Runnable没有抛出异常。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>       <span class="token class-name">Thread</span> thread <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">TurningRunner</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token string">"偶数"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread<span class="token punctuation">.</span><span class="token function">setUncaughtExceptionHandler</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MyException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        thread<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
    <span class="token comment">// 实现UncaughtExceptionHandler接口</span>
    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">MyException</span> <span class="token keyword">implements</span> <span class="token class-name">Thread<span class="token punctuation">.</span>UncaughtExceptionHandler</span> <span class="token punctuation">{</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">uncaughtException</span><span class="token punctuation">(</span><span class="token class-name">Thread</span> t<span class="token punctuation">,</span> <span class="token class-name">Throwable</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>t<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" "</span> <span class="token operator">+</span> e<span class="token punctuation">.</span><span class="token function">getMessage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_26-一共有哪几类线程安全问题-对应视频10-3、10-6-10-12" tabindex="-1"><a class="header-anchor" href="#_26-一共有哪几类线程安全问题-对应视频10-3、10-6-10-12" aria-hidden="true">#</a> **26 一共有哪几类线程安全问题？（对应视频10-3、10-6~10-12）   **</h2>
<p>​	运行结果错误，例如a++多线程出现累计结果错误</p>
<p>​	对象发布和初始化时候的错误，例如构造函数中运行线程，this逃逸</p>
<p>​	死锁等活跃性问题</p>
<h2 id="_27-哪些场景需要额外注意线程安全问题-对应视频10-13" tabindex="-1"><a class="header-anchor" href="#_27-哪些场景需要额外注意线程安全问题-对应视频10-13" aria-hidden="true">#</a> **27 哪些场景需要额外注意线程安全问题？（对应视频10-13）   **</h2>
<ol>
<li>
<p>访问共享变量或资源，会有并发风险，比如静态变量。</p>
</li>
<li>
<p>依赖时序的操作。</p>
</li>
<li>
<p>不同数据之间的捆绑关系的时候。</p>
</li>
</ol>
<h2 id="_28-为什么多线程会带来性能问题-对应视频10-14" tabindex="-1"><a class="header-anchor" href="#_28-为什么多线程会带来性能问题-对应视频10-14" aria-hidden="true">#</a> **28 为什么多线程会带来性能问题？（对应视频10-14）   **</h2>
<p>体现在两个方面：线程的调度和协作，这两个方面通常都是相辅相成，也就是说<strong>由于线程需要协作，所以会引起资源调度</strong></p>
<ol>
<li>
<p>调度：上下文切换</p>
<p>什么时候会需要线程调度？当运行的线程数大于CPU的核心数，那么操作系统就需要进行调度线程，以便于让每个线程都有机会得到运行。</p>
<p>交互系统CPU调度算法：</p>
<ol>
<li>
<p>时间片轮询调度算法：每个进程被分配一个时间片，允许该进程在该时间段运行，如果在时间片结束时该进程还在运行，则剥夺CPU并分配给另一个进程，如果该进程在时间片结束前阻塞或结束，则CPU立即进行切换。</p>
<p>当时间片选择太长，其降级为先来先服务算法，引起对短的交互请求响应时间长
当时间片选择太短，会导致频繁的进程切换，浪费CPU时间。
通常选择为20ms~50ms.
对进程表中不同进程的大小差异较大的有利，而对进程都是相同大小的不利。</p>
<ol start="2">
<li>
<p>虚拟轮转法：主要基于时间片轮转法进行改进，解决在CPU调度中对于I/O密集型进程的不友好。其设置了一个辅助队列，对于I/O型进程执行完一个时间片之后，则进入辅助队列，CPU调度时总是先检查辅助队列是否为空，如果不为空总是优先调度辅助队列里的进程，直到为空，才调度就绪队列的进程。</p>
</li>
<li>
<p>最高优先级调度算法：选择优先级最高的进程优先执行。</p>
</li>
</ol>
<p>优先级可以静态不变，也可以动态调整</p>
<p>优先数决定优先级</p>
<p>就绪队列可以按照优先级组织</p>
<p>实现简单，但不公平，可能导致优先级低的进程产生饥饿现象。</p>
<p>可能产生优先级反转问题（基于优先级的抢占式算法），即一个低优先级进程持有一个高优先级进程所需要的资源，使得高优先级进程等待低优先级进程运行。</p>
<ol start="4">
<li>多级反馈队列调度算法：</li>
</ol>
<p>设置多个就绪队列，并为各个队列赋予不同的优先级。第一个队列的优先级最高，依次递减优先级。
对于各个队列进程执行时间片的大小也不同，优先级越高的队列，分配到的时间片越少。
当第一级队列为空时，再第二级队列进行调度，依次类推，各级队列按照时间片轮转方式进行调度。
当一个新进程创建后，首先把它放入第一队列的末尾。按照FCFS原则排队等待调度。当轮到该进程执行时，如它在该时间片完成，便可准备撤离系统，如果它在一个时间片结束时尚未完成，则调度程序便将该进程转入第二队列的末尾，再同样地按照FCFS原则等待调度执行。依次类推.</p>
</li>
</ol>
</li>
<li>
<p>缓存开销</p>
<p>除了刚才提到的上下文切换会存在直接开销外，还需要考虑到间接带来的缓存失效问题。我们知道程序大概率在访问刚才访问的资源的时候，CPU为了加快速度，通常会把数据缓存到CPU内，这样访问速度会更快。</p>
<p>但是现在上下文被切换了，也就是说，CPU即将执行不同的线程的代码，那么原来缓存在数据大概率也没有什么价值了，这就需要CPU再次进行缓存，这导致了线程在调度运行后，一开始的启动速度会有点慢。</p>
</li>
</ol>
<h2 id="_29-什么是多线程的上下文切换-对应视频10-14" tabindex="-1"><a class="header-anchor" href="#_29-什么是多线程的上下文切换-对应视频10-14" aria-hidden="true">#</a> **29 什么是多线程的上下文切换？（对应视频10-14）   **</h2>
<p>进程和线程的区别：进程是资源分配和执行的基本单位；线程是任务调度和运行的基本单位；线程没有资源，进程给指针提供虚拟内存、栈、变量等共享资源，而线程可以共享进行的资源。</p>
<pre><code>1. 不通进程之间的线程上下文切换，其过程和进程上下文切换大致相同
2. 进行内部的线程进行上下文切换，不需要切换进程的用户资源，只需要切换线程的私有数据和寄存器等。这会比进程上下文切换切换消耗的资源少，所以多线程比多进程优势。
</code></pre>
<p>中断上下文切换：</p>
<p>快速响应硬件的时间，中断处理会打断进程的正常调度和执行。同一CPU内，硬件中断优先级高于进程。切换过程类似系统调用，不涉及到用于运行资源。但是大量的中断上下文切换也可能会引发性能问题。</p>
<h2 id="_30-java代码如何一步步转化-最终被cpu执行-对应视频12-3" tabindex="-1"><a class="header-anchor" href="#_30-java代码如何一步步转化-最终被cpu执行-对应视频12-3" aria-hidden="true">#</a> **30 Java代码如何一步步转化，最终被CPU执行？（对应视频12-3）   **</h2>
<ol>
<li>
<p>最开始是我们编写的.java文件</p>
</li>
<li>
<p>编译javac命令后，我们将.java文件编译成一个.class文件</p>
</li>
<li>
<p>jvm执行编译的.class文件，将字节码文件转换为机器指令</p>
</li>
<li>
<p>机器指令可以直接在CPU上执行，最终的程序执行</p>
<h2 id="_31-单例模式的作用和适用场景-对应视频13-9-13-13" tabindex="-1"><a class="header-anchor" href="#_31-单例模式的作用和适用场景-对应视频13-9-13-13" aria-hidden="true">#</a> **31 单例模式的作用和适用场景（对应视频13-9~13-13）   **</h2>
</li>
<li>
<p>单例模式的作用</p>
<ul>
<li>
<p>节省内存、节省计算</p>
<p>很多情况下，我们只需要一个实例就足够了，如果出现了多实例，有时候就是资源浪费，比如：我们花了很长时间读取一个文件内容，并且存储在内存中，那么以后我们都使用这个实例，不需要每次进行读取。</p>
</li>
<li>
<p>保证结果正确</p>
<p>有时候更多的实例更容易出现错误。比如： 我们需要一个全局计时器，如果是多实例，可能会导致程序错误。</p>
</li>
<li>
<p>方便管理</p>
<p>例如工具类</p>
</li>
</ul>
</li>
</ol>
<h2 id="_32-重排序的实例-单例模式多种写法、单例和高并发的关系-重要-真实面试高频考题-我遇到了-不止一次了-重点讲双重检查模式的volatile-对应视频13-11" tabindex="-1"><a class="header-anchor" href="#_32-重排序的实例-单例模式多种写法、单例和高并发的关系-重要-真实面试高频考题-我遇到了-不止一次了-重点讲双重检查模式的volatile-对应视频13-11" aria-hidden="true">#</a> <strong>32 重排序的实例：单例模式多种写法、单例和高并发的关系（重要，真实面试高频考题，我遇到了</strong> **不止一次了，重点讲双重检查模式的volatile）（对应视频13-11） **</h2>
<p>单例模式有很多中写法</p>
<ol>
<li>
<p>饿汉式（静态常量）</p>
</li>
<li>
<p>饿汉式（静态代码块）</p>
</li>
<li>
<p>懒汉式（线程不安全）</p>
</li>
<li>
<p>懒汉式（线程安全，同步方法）</p>
</li>
<li>
<p>懒汉式（线程安全，同步代码块）</p>
</li>
<li>
<p>双重检查</p>
</li>
<li>
<p>静态内部类</p>
</li>
<li>
<p>枚举</p>
</li>
<li>
<p>饿汉式（静态常量）【可用】</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 饿汉式 静态常量
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton1</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Singleton1</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">Singleton1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton1</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>优点： 写法简单，类装载的时候就完成了初始化，避免线程安全。</p>
<p>缺点： 在类装载的时候就完成实例化，没有达到Lazy Loading的效果。如果一直都没有使用过该实例，会造成资源浪费。</p>
</li>
<li>
<p>饿汉式（静态代码块）[可用]</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 饿汉式 静态代码块
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton2</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton2</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token keyword">static</span> <span class="token punctuation">{</span>
        <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton2</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token class-name">Singleton2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton2</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>懒汉式（线程不安全）【不可用】</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 懒汉式 线程不安全
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton3</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton3</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>


    <span class="token keyword">private</span> <span class="token class-name">Singleton3</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton3</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">INSTANCE</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton3</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种写法起到了Lazy Loading的效果，但是只能在单线程下使用。如果在多线程，会导致多个实例创建，所线程下不可用。</p>
</li>
<li>
<p>懒汉式（线程安全，同步方法）[不推荐使用]</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 懒汉式 同步方法
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton4</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton4</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>


    <span class="token keyword">private</span> <span class="token class-name">Singleton4</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">synchronized</span> <span class="token keyword">static</span> <span class="token class-name">Singleton4</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">INSTANCE</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton4</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>解决了上面第三种的线程不安全问题。</p>
<p>缺点： 效率低下，每个线程来进行获取实例的时候，都会进行getInstance方法的同步，而创建实例只需要一次就可以进行实例化，所有的获取getInstance应该只需要直接返回即可。</p>
</li>
<li>
<p>懒汉式（线程安全，同步代码块）[不推荐使用]</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 懒汉式 同步代码块
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton5</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Singleton5</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>


    <span class="token keyword">private</span> <span class="token class-name">Singleton5</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton5</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">INSTANCE</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">Singleton5</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton5</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>由于第四种同步方法效率太低，所以改为同步代码块的方式，但是这种方式并不能真正的保证线程安全，假如一个线程进入了if (INSTANCE == null) {}，但是还没有进行下一个synchronized，另外一个线程就进行抢占，那么也会进行创建到多个实例。</p>
</li>
<li>
<p>双重检查【推荐面试使用】</p>
</li>
</ol>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 双重检查
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton6</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">static</span> <span class="token class-name">Singleton6</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>


    <span class="token keyword">private</span> <span class="token class-name">Singleton6</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton6</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">INSTANCE</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span><span class="token class-name">Singleton6</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token constant">INSTANCE</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton6</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Double check概念对于多线程开发者来说不陌生，如代码所示，我们进行两次的if(INSTANCE == null)判断检查，这样就会保证线程安全。这样，实例代码是需要进行实例化一次，后面访问的时候，第一个if判断就会直接进行数据返回。</p>
<p><strong>注意：这里synchronized不能写成synchronized(this)，因为getInstance是一个静态方法，静态方法内部不能使用未静态的或者未实例化的类对象</strong></p>
<p>有点： 线程安全；延时加载；效率较高;</p>
<ol>
<li>
<p>为什么需要double-check</p>
<p>a. 需要第二重检查的原因？</p>
<p>​		考虑到这样一种情况，就是两个线程同时到达，即同时调用getInstance方法，此时由于INSTANCE== null，所以两个线程都会进入第一个if判断，现在由于有synchronized锁机制，那么只有一个线程能获取到锁，进入第二重if判断INSTANCE == null 而另外一个线程在等待锁释放。</p>
<p>而当第一个线程执行完new Singleton6()后，会退出锁定区域，那么如果没有第二重if，另外一个线程就会直接进行new Singleton6()创建实例了。这样也还是违背了单例模式的初衷，所以需要双重检查。</p>
<p>b. 需要第一重检查的原因?</p>
<p>​		如果去掉第一重if判断，程序还是可以在多线程下安全的运行，但是会直接进入synchronized的锁机制中，这样无形中增加了性能开销。</p>
</li>
<li>
<p>为甚么要使用volatile?</p>
</li>
</ol>
<p>主要在于INSTANCE= new Singleton6()这句，这个并不是一个原子操作，实际上JVM中这句代码一共执行了以下三件事情。</p>
<ul>
<li>给instance分配了内存</li>
<li>调用Singleton6的构造函数来初始化成员变量</li>
<li>将INSTANCE对象指向分配的内存空间（执行完这一步INSTANCE就是非null了）</li>
</ul>
<p>但是JVM在即时编译器中存在指令重排序的优化。也就是上面的第二步和第三步顺序可能存在颠倒。那么执行顺序可能是1-2-3/1-3-2,如果是后者，那么在3执行完毕，2还未执行，线程已经被暂停，这个时候另外的线程才进行进行第一重检查，看到if已经不为null，那么就执行返回。那么就会导致该对象的构造函数并没有被初始化（null/false/0等值），那么程序就会报错或者得到非预期的值。</p>
<p>不过，如果线程一已经把synchronized的同步块都执行完毕，那么此时的instance一定是正确构造后的实例了，这是由于synchronized的happens-befor原则保证的。</p>
<ol start="7">
<li>
<p>静态内部类【可用】</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 静态内部类
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Singleton7</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">static</span> <span class="token class-name">Singleton7</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>


    <span class="token keyword">private</span> <span class="token class-name">Singleton7</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">SingletionInstance</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Singleton7</span> <span class="token constant">INSTANCE</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Singleton7</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Singleton7</span> <span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">SingletionInstance</span><span class="token punctuation">.</span><span class="token constant">INSTANCE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种方式和饿汉式方式机制类似，但是又有不同。两者都采用了类装载的机制来保证初始化实例的时候只有一个线程。不同的地方在于饿汉式方式只要Singleton类被装载就会实例化，没有进行Lazy Loading的作用，而静态内部类的方式Singleton类被装载的时候并不会立即实例化，而是在需要实例化时，调动getInstance方法，才会装载内部类完成实例化。</p>
<p><strong>类的静态属性只会在第一次加载类的时候初始化，所以在这里，JVM帮助我们保证了线程安全，在类进行初始化的时候，其他线程无法进入。</strong></p>
<p>优点： 避免线程不安全，延时加载，效率高；</p>
</li>
<li>
<p>枚举【推荐实际生产中使用】</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>
<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-12
 * 枚举
 */</span>
<span class="token keyword">public</span> <span class="token keyword">enum</span> <span class="token class-name">Singleton8</span> <span class="token punctuation">{</span>
    <span class="token constant">INSTANCE</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">whatever</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doSomthing</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>借助JDK1.5中的枚举来实现单例模式，不仅能避免多线程同步问题，还是Lazy Loading,还能预防反序列化重新创建新的对象；</p>
</li>
</ol>
<h2 id="_33-单例各种写法的适用场合-对应视频13-13" tabindex="-1"><a class="header-anchor" href="#_33-单例各种写法的适用场合-对应视频13-13" aria-hidden="true">#</a> **33 单例各种写法的适用场合（对应视频13-13）   **</h2>
<ol>
<li>最好的方式是使用枚举，还可以防止反序列化重新创建新的对象；</li>
<li>非线程同步的方法不能使用</li>
<li>如果程序一开始要加载的资源太多，应该使用懒加载</li>
<li>饿汉式如果对象的创建需要配置文件就不适用</li>
<li>懒加载虽好，但是静态内部类这种方式会引入编程的复杂性，大部分情况还是推荐枚举</li>
</ol>
<h2 id="_34-饿汉式的缺点-对应视频13-13" tabindex="-1"><a class="header-anchor" href="#_34-饿汉式的缺点-对应视频13-13" aria-hidden="true">#</a> **34 饿汉式的缺点？（对应视频13-13）   **</h2>
<p>​		效率不高，没有使用懒加载，资源创建了可能一次都使用不到，造成资源浪费</p>
<h2 id="_35-懒汉式的缺点-对应视频13-13" tabindex="-1"><a class="header-anchor" href="#_35-懒汉式的缺点-对应视频13-13" aria-hidden="true">#</a> **35 懒汉式的缺点？（对应视频13-13）   **</h2>
<p>​		有可能存在多线程问题，第一次加载较慢，使用同步开销较大</p>
<h2 id="_36-为什么要用double-check-不用就不安全吗-对应视频13-11" tabindex="-1"><a class="header-anchor" href="#_36-为什么要用double-check-不用就不安全吗-对应视频13-11" aria-hidden="true">#</a> **36 为什么要用double-check？不用就不安全吗？（对应视频13-11）   **</h2>
<p>​	使用为了更好的保证线程安全</p>
<h2 id="_37-为什么双重检查模式要用volatile-对应视频13-11" tabindex="-1"><a class="header-anchor" href="#_37-为什么双重检查模式要用volatile-对应视频13-11" aria-hidden="true">#</a> **37 为什么双重检查模式要用volatile？（对应视频13-11）   **</h2>
<p>主要原因为创建对象的过程不是原子操作，会存在指令重排序问题。</p>
<h2 id="_38-应该如何选择-用哪种单例的实现方案最好-对应视频13-13" tabindex="-1"><a class="header-anchor" href="#_38-应该如何选择-用哪种单例的实现方案最好-对应视频13-13" aria-hidden="true">#</a> **38 应该如何选择，用哪种单例的实现方案最好？（对应视频13-13）   **</h2>
<p>​			<strong>使用枚举最好</strong></p>
<p>Joshua Bloch在《Effective Java》中描述过；“使用枚举实现单例的方法虽然还没有被广泛采用，但是单元素的枚举类型已经成为实现Singleton的最佳方法”.</p>
<ol>
<li>
<p>写法简单优雅</p>
</li>
<li>
<p>线程安全有保障</p>
</li>
<li>
<p>避免反序列化破坏单例</p>
<p>**普通的java类进行反序列化的时候，会通过反射调用类的默认构造函数来初始化对象。**所以，即使单例是构造函数私有，但是也会被反射破坏，由于反序列化的对象时重新new出来的，所以就可以破坏单例。</p>
<p>但是，<strong>枚举的反序列化不是通过反射实现的</strong>所以，也就不会出现单例被反射破坏。</p>
<p>枚举反序列化原理：</p>
<p>我们知道一旦实现了Serializable接口之后，反序列化时每次调用 readObject()方法返回的都是一个新创建出来的对象.</p>
<p>而枚举则不同,在序列化的时候Java仅仅是将枚举对象的name属性输出到结果中，反序列化的时候则是通过Enum的<code v-pre>valueOf()</code>方法来根据名字查找枚举对象。同时，编译器是不允许任何对这种序列化进行定制，因此禁用了<code v-pre>writeObject</code>、<code v-pre>readObject</code>、<code v-pre>readObjectNoData</code>、<code v-pre>writeReplace</code>和<code v-pre>readResolve</code>等方法.</p>
<p>https://www.jianshu.com/p/0d69c36a723b</p>
<h2 id="_39-讲一讲什么是java内存模型-对应视频第12、13章" tabindex="-1"><a class="header-anchor" href="#_39-讲一讲什么是java内存模型-对应视频第12、13章" aria-hidden="true">#</a> **39 讲一讲什么是Java内存模型？（对应视频第12、13章）   **</h2>
<p><a href="https://naotu.baidu.com/file/46b642f97ab6f797505f2f24ec276762" target="_blank" rel="noopener noreferrer">脑图<ExternalLinkIcon/></a></p>
<p><strong>Java内存模型指的是一种虚拟机的规范。</strong></p>
<p>Java虚拟机规范中定义了Java内存模型（Java Memory Model,JVM），用于屏蔽各种硬件和操作系统的内存访问差异，以实现让Java程序在各种平台下都能达到一致的并发效果，JVM规范了Java虚拟机与计算机内存是如何协同工作的：规定了一个线程和何时可以看到由其他线程修改后的共享变量的值，以及在必须时如何同步的访问共享变量。</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201040222.png" alt="image-20211013092841769-16346333399473"></p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041471.png" alt="image-20211013092854837"></p>
<p><strong>现代计算机硬件架构采用的是多级缓存架构</strong>  如下图所示：</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041697.png" alt="image-20211013093251537-16346333455204"></p>
<p><strong>缓存一致性问题</strong>：在多处理器系统中，每个处理器都有自己的高速缓存，而它们又共享同一主内存（MainMemory）。基于高速缓存的存储交互很好地解决了处理器与内存的速度矛盾，但是也引入了新的问题：缓存一致性（CacheCoherence）。当多个处理器的运算任务都涉及同一块主内存区域时，将可能导致各自的缓存数据不一致的情况，如果真的发生这种情况，那同步回到主内存时以谁的缓存数据为准呢？为了解决一致性的问题，需要各个处理器访问缓存时都遵循一些协议，在读写时要根据协议来进行操作，这类协议有MSI、MESI（IllinoisProtocol）、MOSI、Synapse、Firefly及DragonProtocol，等等：</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041787.png" alt="image-20211013093346798"></p>
<p><strong>Java内存模型和硬件内存架构之间的桥接</strong></p>
<p>Java内存模型与硬件内存架构之间的差异。硬件内存架构没有区分Java中的堆，栈等。对于硬件，所有的线程栈和堆数据都存储在主内存中。部分线程和堆数据有时候会出现在CPU缓存和CPU内部寄存器中。如下图所示：</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041942.png" alt="image-20211013093616551-16346333509375"></p>
<p>内存模型解决的问题，最重要的是三个部分的内容：<strong>指令重排序、可见性、原子性</strong></p>
<p>可见性： 线程对共享变量修改，A线程修改后，其他线程能立即得知这个修改；</p>
<p>指令重排序： 源代码--&gt;编译器优化重排序---&gt;指令级并行重排序---&gt;内存系统重排序----&gt;最终执行的指令序列。</p>
<p>原子性： 指一个操作是按照原子方式执行。那么该操作以原子方式执行，即执行过程中不会被其他线程打断。</p>
<p><strong>JVM定义关于主内存和工作内存的具体交互协议，即一个变量如何从主内存拷贝到工作内存，如何从工作内存同步到主内存的具体细节</strong>，Java内存模型定义了以下八种操作：</p>
<ul>
<li>lock： 作用于主内存变量，把一个变量表示为一条线程独占状态；</li>
<li>unlock： 作用于主内存变量，把一个处于锁定状态的变量释放出来，释放后才能被其他线程锁定；</li>
<li>read：作用于主内存变量，把一个变量值从主内存传输到工作内存中，以便于随后的load动作使用；</li>
<li>load： 作用于工作内存变量，把read操作的主内存得到的变量放入工作内存的副本中；</li>
<li>use：作用于工作内存变量，把工作内存的一个变量值传递给执行引擎，每当虚拟机遇到一个需要使用变量的值的字节码指令时将会执行这个操作；</li>
<li>assign： 作用于工作内存变量，把一个从执行引擎接收到的赋值给工作内存的变量，每当虚拟机遇到一个给变量赋值的字节码指令时执行这个操作；</li>
<li>store： 作用于工作内存变量，把工作内存中的一个变量的值传递到主内存中，便于随后的write指令操作；</li>
<li>wtire： 作用于主内存，将store操作从工作内存的值写入到主内存变量中；</li>
</ul>
<p><strong>as-if-serial语义：</strong></p>
<p>无论如何重排序，程序的指定结果不能被改变。</p>
<p><strong>happens-befor原则：</strong></p>
<ul>
<li>
<p><strong>程序次序规则： 一个线程内，按照代码书写顺序，先写的代码操作先行发生于后面的代码；</strong></p>
</li>
<li>
<p><strong>锁定规则： 一个unlock操作先行于后面对同一个锁的lock操作。即无论是单线程还是多线程中，同一个锁如果被处于锁定状态，那么必须要进行unlock操作，后面才能进行lock操作</strong>；</p>
</li>
<li>
<p><strong>volatile变量规则： 对一个变量的写操作先行发生于后面对这个变量的读操作；</strong></p>
</li>
<li>
<p><strong>传递规则： 如果操作A先行发生于操作B，而操作B先行发生于C，那么A必定先行发生于C；</strong></p>
</li>
<li>
<p>线程启动规则： Thread对象的start方法先行于此线程的每一个动作；</p>
</li>
<li>
<p>线程中断规则： 对于线程interrupt方法的调用先行发生于被中断的线程检测到中断事件的发生；</p>
</li>
<li>
<p>线程终结规则： 线程的所有操作都先行于终结检测；</p>
</li>
<li>
<p>对象终结规则： 一个对象的初始完成先行于对它的finalize方法的开始；</p>
<p><strong>happens-before规则是用来解决可见性问题：在时间上，动作A发生在动作B之前，B保证能看到A操作，这就是happens-before规则；</strong></p>
</li>
</ul>
<h2 id="_40-什么是happens-before-对应视频12-13-12-15" tabindex="-1"><a class="header-anchor" href="#_40-什么是happens-before-对应视频12-13-12-15" aria-hidden="true">#</a> **40 什么是happens-before？（对应视频12-13~12-15）   **</h2>
<p>​	在时间上，动作A发生在动作B之前，B保证能看到A操作，这就是happens-before规则；</p>
<h2 id="_41-happens-before规则有哪些-对应视频12-14" tabindex="-1"><a class="header-anchor" href="#_41-happens-before规则有哪些-对应视频12-14" aria-hidden="true">#</a> **41 Happens-Before规则有哪些？（对应视频12-14）   **</h2>
<ul>
<li>
<p><strong>程序次序规则： 一个线程内，按照代码书写顺序，先写的代码操作先行发生于后面的代码；</strong></p>
</li>
<li>
<p><strong>锁定规则： 一个unlock操作先行于后面对同一个锁的lock操作。即无论是单线程还是多线程中，同一个锁如果被处于锁定状态，那么必须要进行unlock操作，后面才能进行lock操作</strong>；</p>
</li>
<li>
<p><strong>volatile变量规则： 对一个变量的写操作先行发生于后面对这个变量的读操作；</strong></p>
</li>
<li>
<p><strong>传递规则： 如果操作A先行发生于操作B，而操作B先行发生于C，那么A必定先行发生于C；</strong></p>
</li>
<li>
<p>线程启动规则： Thread对象的start方法先行于此线程的每一个动作；</p>
</li>
<li>
<p>线程中断规则： 对于线程interrupt方法的调用先行发生于被中断的线程检测到中断事件的发生；</p>
</li>
<li>
<p>线程终结规则： 线程的所有操作都先行于终结检测；</p>
</li>
<li>
<p>对象终结规则： 一个对象的初始完成先行于对它的finalize方法的开始；</p>
</li>
</ul>
<h2 id="_42-讲讲volatile关键字-对应视频13-1-13-5" tabindex="-1"><a class="header-anchor" href="#_42-讲讲volatile关键字-对应视频13-1-13-5" aria-hidden="true">#</a> **42 讲讲volatile关键字？（对应视频13-1~13-5）   **</h2>
<p>volatile: 主要作用是一个线程修改变量，其他线程可以即时得到修改的值。</p>
<ul>
<li>保证内存可见性</li>
<li>禁止指令重排序</li>
</ul>
<p>原理： 加入volatile关键字的变量，在汇编的时候会多出一个lock前缀指令，主要作用为：</p>
<p><strong>lock后的写操作会直接写回主存，同时使得其他的CPU缓存cache失效</strong></p>
<p><strong>添加屏障，禁止指令重排序</strong></p>
<h2 id="_43-volatile和synchronized的异同-对应视频13-5" tabindex="-1"><a class="header-anchor" href="#_43-volatile和synchronized的异同-对应视频13-5" aria-hidden="true">#</a> **43 volatile和synchronized的异同？（对应视频13-5）   **</h2>
<p>volatile可以看做是synchronized的轻量级版本，如果一个共享变量自始至终只被各个线程赋值，而没有其他的操作，那么就可以使用volatile代替synchronized或者代替原子变量，因为赋值自身是具有原子性的，而volatile又保证了可见性，那么就可以保证线程安全。</p>
<ul>
<li>
<p>线程阻塞：volatile不会，syn会阻塞</p>
</li>
<li>
<p>作用级别： vol作用于变量，syn方法，代码块，类</p>
</li>
<li>
<p>性质： vol可见性，并不能保证原子性，syn可以保证可见性和原子性</p>
</li>
</ul>
<h2 id="_44-什么是内存可见性问题-对应视频12-9-12-11" tabindex="-1"><a class="header-anchor" href="#_44-什么是内存可见性问题-对应视频12-9-12-11" aria-hidden="true">#</a> **44 什么是内存可见性问题？（对应视频12-9~12-11）   **</h2>
<p>​	CPU的缓存架构图：</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041789.png" alt="image-20211013103058572-16346333576616"></p>
<p>Java作为高级语言，屏蔽了底层操作细节，JVM规范定义了一套读写内存数据的规范，用来保证多线程环境下共享变量对于任意线程获取的数据都是一致的，并且修改后其他线程可以即时得到最新变量的值。</p>
<h2 id="_45-主内存和本地内存的关系-对应视频12-12" tabindex="-1"><a class="header-anchor" href="#_45-主内存和本地内存的关系-对应视频12-12" aria-hidden="true">#</a> **45 主内存和本地内存的关系（对应视频12-12）   **</h2>
<ol>
<li>所有的变量都存储在主内存中，同时每个线程也有自己的独立工作内存，工作内存中的变量内容是主存的变量数据拷贝。</li>
<li>线程不能直接读取主存的变量，只能操作工作内存的变量，然后同步到主存。</li>
<li>主内存变量线程共享，工作内存私有，如果线程间需要进行通讯，必须借助于主内存中转。</li>
</ol>
<p>所有的共享变量存储在主内存中，每个线程都有自己的本地内存，而且线程读写共享变量也是通过本地内存交换的，所以才导致了可见性问题。</p>
<p>操作系统会尽可能抓取机会同步（只要CPU等有空闲，就去同步），而不是等要用到的时候再去同步。</p>
<h2 id="_46-什么是原子操作-对应视频13-7" tabindex="-1"><a class="header-anchor" href="#_46-什么是原子操作-对应视频13-7" aria-hidden="true">#</a> **46 什么是原子操作？（对应视频13-7）   **</h2>
<p>​	原子操作是指一系列操作要么全部成功，要么全部失败。</p>
<h2 id="_47-java中的原子操作有哪些-对应视频13-7" tabindex="-1"><a class="header-anchor" href="#_47-java中的原子操作有哪些-对应视频13-7" aria-hidden="true">#</a> **47 Java中的原子操作有哪些？（对应视频13-7）   **</h2>
<ul>
<li>除long,double之外的基本类型（int,byte,boolean,short,char,float）的赋值操作</li>
<li>所有引用reference的赋值操作，不管是32/64位机器</li>
<li>java.concurrent.Atomic.*下的所有原子类</li>
</ul>
<h2 id="_48-long-和-double-的原子性你了解吗-对应视频13-8" tabindex="-1"><a class="header-anchor" href="#_48-long-和-double-的原子性你了解吗-对应视频13-8" aria-hidden="true">#</a> **48 long 和 double 的原子性你了解吗？（对应视频13-8）   **</h2>
<p>​		对于64位的值的写入，是分为两步写入的，long，double都是64位，所以分为两次32位写入，所以理论上可能出现错误。</p>
<p>​		在两次写入的过程中，可能存在才写入32位数据，另外的线程就进行读取，所以发生错误的情况</p>
<p>​	添加volatile关键字解决问题。</p>
<h2 id="_49-生成对象的过程是不是原子操作-对应视频13-11" tabindex="-1"><a class="header-anchor" href="#_49-生成对象的过程是不是原子操作-对应视频13-11" aria-hidden="true">#</a> **49 生成对象的过程是不是原子操作？（对应视频13-11）   **</h2>
<p>​	不是原子操作</p>
<p>​	new Object()过程：</p>
<ol>
<li>
<p>检查类是否被加载</p>
</li>
<li>
<p>为对象分配内存</p>
</li>
<li>
<p>为分配的内存空间初始化零值</p>
</li>
<li>
<p>对对象进行其他设置</p>
</li>
<li>
<p>执行init方法</p>
<p>到这里基本就算是对象创建完毕了。</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201041520.png" alt="image-20211013111754225-16346333635677"></p>
</li>
</ol>
<h2 id="_50-写一个必然死锁的例子-对应视频14-5" tabindex="-1"><a class="header-anchor" href="#_50-写一个必然死锁的例子-对应视频14-5" aria-hidden="true">#</a> **50 写一个必然死锁的例子？（对应视频14-5）   **</h2>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-13
 * 死锁例子： 需要注意的是lock1,lock2必须是静态常量，无法是无法锁住的
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DieLockTest</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> lock1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token class-name">Object</span> lock2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">public</span> <span class="token class-name">Integer</span> flag <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">DieLockTest</span> t1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DieLockTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">DieLockTest</span> t2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DieLockTest</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        t1<span class="token punctuation">.</span>flag <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
        t2<span class="token punctuation">.</span>flag <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> r1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>t1<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Thread</span> r2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>t2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        r1<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        r2<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>flag <span class="token operator">==</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 获取到锁1"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 获取到锁2"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>flag <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 获取到锁2"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">try</span> <span class="token punctuation">{</span>
                    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lock1<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">" 获取到锁1"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_51-生产中什么场景下会发生死锁-对应视频14-6、14-7" tabindex="-1"><a class="header-anchor" href="#_51-生产中什么场景下会发生死锁-对应视频14-6、14-7" aria-hidden="true">#</a> **51 生产中什么场景下会发生死锁？（对应视频14-6、14-7）   **</h2>
<p>获取多个锁的情况下，都有风险，最明显的是一个方法内要获取多个锁，或者是锁形成了环路。</p>
<p><a href="https://naotu.baidu.com/file/f5dd3f0d5d757a06916da33b62d6b390" target="_blank" rel="noopener noreferrer">死锁<ExternalLinkIcon/></a></p>
<h2 id="_52-发生死锁必须满足哪些条件-对应视频14-8" tabindex="-1"><a class="header-anchor" href="#_52-发生死锁必须满足哪些条件-对应视频14-8" aria-hidden="true">#</a> **52 发生死锁必须满足哪些条件？（对应视频14-8）   **</h2>
<ol>
<li>互斥条件</li>
<li>请求与保持</li>
<li>不剥夺条件</li>
<li>循环等待</li>
</ol>
<h2 id="_53-如何用工具定位死锁-对应视频14-9、14-10" tabindex="-1"><a class="header-anchor" href="#_53-如何用工具定位死锁-对应视频14-9、14-10" aria-hidden="true">#</a> **53 如何用工具定位死锁？（对应视频14-9、14-10）   **</h2>
<ol>
<li>使用jstack命令，jdk自带</li>
<li>ThreadMXBean类</li>
</ol>
<p>​	jstack:</p>
<p>​		运行线程类，jps得到程序的pid，使用${JAVA_HOME}/bin/jstack $pid就可以得到如下信息</p>
<p>​		<img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201042865.png" alt="image-20211013130057114-16346333701198"></p>
<p>​</p>
<p>​		ThreadMXBean方法</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code>	<span class="token comment">// 以上是线程调用代码</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">ThreadMXBean</span> threadMXBean <span class="token operator">=</span> <span class="token class-name">ManagementFactory</span><span class="token punctuation">.</span><span class="token function">getThreadMXBean</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span><span class="token punctuation">[</span><span class="token punctuation">]</span> deadlockedThreads <span class="token operator">=</span> threadMXBean<span class="token punctuation">.</span><span class="token function">findDeadlockedThreads</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>deadlockedThreads <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> deadlockedThreads<span class="token punctuation">.</span>length <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> deadlockedThreads<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token class-name">ThreadInfo</span> threadInfo <span class="token operator">=</span> threadMXBean<span class="token punctuation">.</span><span class="token function">getThreadInfo</span><span class="token punctuation">(</span>deadlockedThreads<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发现死锁"</span> <span class="token operator">+</span> threadInfo<span class="token punctuation">.</span><span class="token function">getThreadName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"  "</span> <span class="token operator">+</span> threadInfo<span class="token punctuation">.</span><span class="token function">getThreadState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_54-有哪些解决死锁问题的策略-对应视频14-11-14-15" tabindex="-1"><a class="header-anchor" href="#_54-有哪些解决死锁问题的策略-对应视频14-11-14-15" aria-hidden="true">#</a> **54 有哪些解决死锁问题的策略？（对应视频14-11~14-15）   **</h2>
<ul>
<li>
<p>避免策略（哲学家就餐换手方案、转账换序方案、银行家算法）</p>
</li>
<li>
<p>检测与恢复策略（一段时间检测是否有死锁，如果有就剥落其中的一个资源，来打开死锁）</p>
</li>
<li>
<p>鸵鸟策略：</p>
<p>如果我们发生死锁的概率很低，那么我们直接忽略它，直到发生了锁死，进行人工修复</p>
</li>
</ul>
<h2 id="_55-讲一讲经典的哲学家就餐问题-经典名称叫刀叉问题、吃面问题-对应视频14-12-14-14" tabindex="-1"><a class="header-anchor" href="#_55-讲一讲经典的哲学家就餐问题-经典名称叫刀叉问题、吃面问题-对应视频14-12-14-14" aria-hidden="true">#</a> **55 讲一讲经典的哲学家就餐问题？（经典名称叫刀叉问题、吃面问题）（对应视频14-12~14-14）   **</h2>
<p>哲学家问题描述： 有五个哲学家围在一张圆桌，分别坐在周围的五张椅子上，在圆桌上有五个碗和5支筷子，他们的生活方式是交替的进行思考和进餐。平时，一个哲学家进行思考，饥饿时便试图取用其左右最靠近他的筷子，只有在他拿到两支筷子时才能进餐。进餐完毕后，放下筷子继续思考。</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201042451.png" alt="image-20211013143504831-16346333774749"></p>
<p>从最上面顺时针分别是亚里士多德、柏拉图、苏格拉底、法国哲学家伏尔泰、发过哲学家笛卡尔。</p>
<p>流程：</p>
<p>​		哲学家如果想吃饭了，他会先拿左手的筷子，然后拿起右手的筷子，如果筷子被人使用了，那就得等别人吃完饭后，放下筷子。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-13
 * 哲学家就餐问题，模拟发生死锁情况
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DiningPhilosophers</span> <span class="token punctuation">{</span>


    <span class="token doc-comment comment">/**
     * 哲学家类
     */</span>
    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Philosophers</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token class-name">Object</span> lestChoptick<span class="token punctuation">;</span>
        <span class="token keyword">private</span> <span class="token class-name">Object</span> rightChopstick<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Philosophers</span><span class="token punctuation">(</span><span class="token class-name">Object</span> left<span class="token punctuation">,</span> <span class="token class-name">Object</span> rightChopstick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>lestChoptick <span class="token operator">=</span> left<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>rightChopstick <span class="token operator">=</span> rightChopstick<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"思考问题"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lestChoptick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"拿到左边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>rightChopstick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"拿到右边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"可以进行吃饭了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"放下右边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"放下左边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/**
         * 显示输出效果，并且进行一个随机的休眠，也就是每一个动作都有耗时
         *
         * <span class="token keyword">@param</span> <span class="token parameter">action</span>
         */</span>
        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token class-name">String</span> action<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"  "</span> <span class="token operator">+</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Philosophers</span><span class="token punctuation">[</span><span class="token punctuation">]</span> philosophers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Philosophers</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> chopsticks <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">[</span>philosophers<span class="token punctuation">.</span>length<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> chopsticks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            chopsticks<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> philosophers<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Object</span> left <span class="token operator">=</span> chopsticks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token class-name">Object</span> right <span class="token operator">=</span> chopsticks<span class="token punctuation">[</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">%</span> chopsticks<span class="token punctuation">.</span>length<span class="token punctuation">]</span><span class="token punctuation">;</span>
            philosophers<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Philosophers</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>philosophers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">"哲学家"</span> <span class="token operator">+</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"号"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201042834.png" alt="image-20211013154210021-163463338351510"></p>
<p>上图为最为典型的死锁问题，就是每个人都拿了左边的筷子，全部都无法获取到右边筷子，陷入死锁等待。</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201042031.png" alt="image-20211013154322660-163463339061711"></p>
<p>上时间的运行后也陷入死锁</p>
<p>解决方案：</p>
<ol>
<li>
<p>服务员检查（避免策略）</p>
<p>我们可以引入一个服务员来解决，每当哲学家要吃饭的时候，他就询问服务员现在我能否吃饭，这样服务员就回去检查，如果死锁将要发生，那么就不允许该哲学家吃饭。</p>
</li>
<li>
<p>改变一个哲学家的拿筷子顺序（避免策略）</p>
<p>我们可以让四个哲学家先拿左手的筷子，再拿右手的筷子，而其中一个哲学家正好相反，先拿右手的筷子，再拿左右的筷子。这样一来就不会出现循环等待同一边筷子的情况。</p>
<div class="language-java ext-java line-numbers-mode"><pre v-pre class="language-java"><code><span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> leihfei
 * <span class="token keyword">@date</span> 2021-10-13
 * 哲学家就餐问题，换手方案解决死锁
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DiningPhilosophers</span> <span class="token punctuation">{</span>


    <span class="token doc-comment comment">/**
     * 哲学家类
     */</span>
    <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Philosophers</span> <span class="token keyword">implements</span> <span class="token class-name">Runnable</span> <span class="token punctuation">{</span>
        <span class="token keyword">private</span> <span class="token class-name">Object</span> lestChoptick<span class="token punctuation">;</span>
        <span class="token keyword">private</span> <span class="token class-name">Object</span> rightChopstick<span class="token punctuation">;</span>

        <span class="token keyword">public</span> <span class="token class-name">Philosophers</span><span class="token punctuation">(</span><span class="token class-name">Object</span> left<span class="token punctuation">,</span> <span class="token class-name">Object</span> rightChopstick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>lestChoptick <span class="token operator">=</span> left<span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>rightChopstick <span class="token operator">=</span> rightChopstick<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"思考问题"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>lestChoptick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"拿到左边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token keyword">synchronized</span> <span class="token punctuation">(</span>rightChopstick<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"拿到右边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"可以进行吃饭了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                        <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"放下右边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                    <span class="token punctuation">}</span>
                    <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token string">"放下左边的筷子"</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/**
         * 显示输出效果，并且进行一个随机的休眠，也就是每一个动作都有耗时
         *
         * <span class="token keyword">@param</span> <span class="token parameter">action</span>
         */</span>
        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">doAction</span><span class="token punctuation">(</span><span class="token class-name">String</span> action<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"  "</span> <span class="token operator">+</span> action<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">try</span> <span class="token punctuation">{</span>
                <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token keyword">long</span><span class="token punctuation">)</span> <span class="token punctuation">(</span><span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">random</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Philosophers</span><span class="token punctuation">[</span><span class="token punctuation">]</span> philosophers <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Philosophers</span><span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> chopsticks <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">[</span>philosophers<span class="token punctuation">.</span>length<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> chopsticks<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            chopsticks<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> philosophers<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Object</span> left <span class="token operator">=</span> chopsticks<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token class-name">Object</span> right <span class="token operator">=</span> chopsticks<span class="token punctuation">[</span><span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">%</span> chopsticks<span class="token punctuation">.</span>length<span class="token punctuation">]</span><span class="token punctuation">;</span>
            <span class="token comment">// 对哲学家进行换手</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">==</span> philosophers<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                philosophers<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Philosophers</span><span class="token punctuation">(</span>right<span class="token punctuation">,</span> left<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                philosophers<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Philosophers</span><span class="token punctuation">(</span>left<span class="token punctuation">,</span> right<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span>philosophers<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token string">"哲学家"</span> <span class="token operator">+</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"号"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进行换手之后就可以避免死锁</p>
</li>
<li>
<p>餐票（避免策略）</p>
</li>
<li>
<p>领导调节（检测与恢复策略）</p>
</li>
</ol>
<h2 id="_56-实际开发中如何避免死锁-对应视频14-16、14-17" tabindex="-1"><a class="header-anchor" href="#_56-实际开发中如何避免死锁-对应视频14-16、14-17" aria-hidden="true">#</a> **56 实际开发中如何避免死锁？（对应视频14-16、14-17）   **</h2>
<ol>
<li>
<p>获取锁的时候，设置一个超时时间</p>
<p>Lock的tryLock(long timeout,TimeUnit unit)</p>
<p>synchronized是没有超时时间的</p>
</li>
<li>
<p>多使用程度的并发类，而不是自己设计锁，降低风险</p>
<p>尽量使用java.util.concurrent(jdk 1.5以上)包的并发类代替手写控制wait,notify并发，比 较常用的是 ConcurrentHashMap、ConcurrentLinkedQueue、AtomicBoolean等等，实际应用中 java.util.concurrent.atomic十分有用，简单方便且效率比使用Lock更高。多用并发集合 少用同步集合，这是另外一个容易遵循且受益巨大的最佳实践，并发集合比同步集合的可扩展性更好， 所以在并发编 程时使用并发集合效果更好。如果下一次你需要用到map，你应该首先想到用 ConcurrentHashMap</p>
</li>
<li>
<p>尽量降低锁的使用粒度：用不同的锁而不是一个锁</p>
<p>分别用不同的锁来保护同一个类中多个独立的状态变量，而不是对整个类域只使用一个 锁。最低限度 的使用同步和锁，缩小临界区</p>
</li>
<li>
<p>如果能使用同步代码块，就不使用同步方法：自己指定锁对象</p>
</li>
<li>
<p>给线程起具有辨别性的名称： debug和排查时事半功倍，框架和JDK都遵循这个最佳实践</p>
</li>
<li>
<p>避免锁的嵌套：比如必然发生锁的嵌套例子</p>
</li>
<li>
<p>分配资源前先看能不能收回来： 银行家算法</p>
</li>
<li>
<p>尽量不要几个功能使用同一把锁：专锁专用</p>
</li>
</ol>
<h2 id="_57-什么是活跃性问题-活锁、饥饿和死锁有什么区别-对应视频14-18-14-21" tabindex="-1"><a class="header-anchor" href="#_57-什么是活跃性问题-活锁、饥饿和死锁有什么区别-对应视频14-18-14-21" aria-hidden="true">#</a> **57 什么是活跃性问题？活锁、饥饿和死锁有什么区别？（对应视频14-18~14-21） **</h2>
<p>死锁是最常见的活跃性问题，不过除了死锁以外，还有类似的一些问题，会导致程序无法顺利执行，统称为活跃性问题。</p>
<ol>
<li>
<p>什么是活锁？</p>
<p>线程没有发生阻塞，但是线程却得不到进展，因为线程始终都在重复做同样的事情。</p>
<p>活锁和死锁的区别： 如果发生死锁，那么两条线程将直接卡死，因为大家都在相互等待锁。如果发生活锁： 线程都不需要资源，一直让让出资源让别的线程使用。</p>
<p>下图为例子：</p>
<p><img src="https://gitee.com/leihfei/NoteImg/raw/master/img/202110201042366.png" alt="image-20211013144524565-163463339871512"></p>
<p>死锁： 两个人都不动，等对方先抬头，他们之间不再说话，只能等待。</p>
<p>活锁： 两个人都不停的说“你先起来”，但是都是一直说话，一直在运行，但是就是不抬头，不起来。</p>
<ol start="2">
<li>
<p>饥饿</p>
<p>当线程需要某些资源时，缺始终得不到，最常见的得不到的就是CPU资源，导致线程无法继续运行，例如：如果某些线程持有锁同时又无限循环从而不释放锁，那么就会导致其他线程“饥饿”。</p>
</li>
</ol>
<p>活锁例子：消息队列，如果某个消息由于上下游原因，始终处理失败，但是失败时的处理策略是重试且放到队 列头部，就会出现活锁问题：无限重试但永远失败。 解决方案是把重试消息放到队列尾部，并且设置重试次数的上限。</p>
<p>如何解决活锁问题？</p>
<p>​	我们发现产生活锁的最主要原因就是因为大家重试的机制是不变的，比如消息队列中， 如果失败也反 复继续重试，而吃饭的例子中，夫妻发现对方饿了就一定会让对方先吃。 所以在重试策略中，我们需要在重试的时候让大家不再使用一样的策略，例如<strong>引入随机因素</strong>，一个非常是典型的例子在以太网中有重试机制，如果发生碰撞，那么双方都会重试，如果没有随机因素，那 么双方会不停在1秒后重发数据包，那么又会碰撞，永无止境。所以以太网协议里，发生碰撞后，等 待的时间并不是固定的，而是重试时间最多在 0 ~ 1023 个时槽范围内随机选择，这就是 <strong>指数退避算法</strong>，很好地解决了活锁问题。 同样，在吃饭的例子中，如果也加入随机因素，比如在配偶饿的时候，我依然有20%几 率可以先吃， 那么也就不会造成两个人都很饿却都不能吃饭的恶劣局面。</p>
</li>
</ol>
<p><a href="https://naotu.baidu.com/file/955eb3ec009ade8818485e0c8a3c338f" target="_blank" rel="noopener noreferrer">面试<ExternalLinkIcon/></a></p>
</li>
</ol>
</div></template>


