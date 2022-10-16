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
<p>进程和线程的区别：进程是资源分配和执行的基本单位；线程是任</p>
</div></template>


