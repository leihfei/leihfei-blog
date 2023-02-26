# JVM优化



## 一、java虚拟机的内存管理

### 1. JVM整体架构

> ```
> 根据 JVM 规范，JVM 内存共分为虚拟机栈、堆、方法区、程序计数器、本地方法栈五个部分。	
> ```

![image-20230216210119127](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jvm%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84.png)



| 名 称          | 特征                                                        | 作用                                                         | 配置参数                                                     | 异常                                 |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------ |
| 程 序 计 数 器 | 占用内存小，线 程私有，生命周 期与线程相同                  | 大致为字节码行号指示 器                                      | 无                                                           | 无                                   |
| 虚 拟 机 栈    | 线程私有，生命 周期与线程相 同，使用连续的 内存空间         | Java 方法执行的内存模 型，存储局部变量表、 操作栈、动态链接、方 法出口等信息 | -Xss                                                         | StackOverflowError/ OutOfMemoryError |
| 堆             | 线程共享，生命 周期与虚拟机相 同，可以不使用 连续的内存地址 | 保存对象实例，所有对 象实例（包括数组）都 要在堆上分配       | -Xms -Xsx -Xmn                                               | OutOfMemoryError                     |
| 方 法 区       | 线程共享，生命 周期与虚拟机相 同，可以不使用 连续的内存地址 | 存储已被虚拟机加载的 类信息、常量、静态变 量、即时编译器编译后 的代码等数据 | -XX:PermSize:16M XX:MaxPermSize64M/- XX:MetaspaceSize=16M XX:MaxMetaspaceSize=64M | OutOfMemoryError                     |
| 本 地 方 法 栈 | 线程私有                                                    | 为虚拟机使用到的 Native 方法服务                             | 无                                                           | StackOverflowError/ OutOfMemoryError |

> JVM分为五大模块： 类装载器子系统 、 运行时数据区 、 执行引擎 、 本地方法接口 和 垃圾收集模块 。  



![image-20230216210247506](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jvm%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84%E5%9B%BE.png)



### 2. JVM运行时内存

![image-20230216210326123](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jvm%E8%BF%90%E8%A1%8C%E6%97%B6%E5%86%85%E5%AD%98.png)

Java7和Java8内存结构的不同主要体现在方法区的实现上

方法区是java虚拟机规范中定义的一种概念上的区域，不同的厂商可以对虚拟机进行不同的实现。我们通常使用的Java SE都是由Sun JDK和OpenJDK所提供，这也是应用最广泛的版本。而该版本使用的VM就是
HotSpot VM。通常情况下，我们所讲的java虚拟机指的就是HotSpot的版本。  

 JDK7内存结构

![image-20230216210529615](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk7%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84.png)



JDK8内存结构

![image-20230216210547409](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk8%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84.png)

针对JDK8虚拟机的内存详解

![image-20230216210708021](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk8%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84%E8%AF%A6%E8%A7%A3.png)

 JDK7和JDK8内存变化小结

![image-20230216210818836](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk78%E5%8F%98%E5%8C%96%E5%B0%8F%E7%BB%93.png)

线程私有的：

1. 程序计数器
2. 本地方法栈
3. 虚拟机栈

线程共享的：

1. 堆
2. 方法区、直接内存（非运行时数据区的一部分）

**对于java8，HotSpots取消了永久代，是不是就没有方法区了呢？**

其实不是，方法区只是一个规范，只不过是它的实现方式变了

在java8中，元空间（Metaspace）登上历史舞台，方法区存在于元空间，同时，方法区不在于堆连续，而是存在本地内存(Native memory)中

方法区Java8之后的变化

- 移出了永久代(PermGen),替换为元空间(Metaspace)
- 永久代中的class metadata(类元信息)转移到了直接内存中
- 永久代中的interned Strings(字符串常量池)和class static variables(类静态变量)转移到了堆
- 永久代参数(PermSize MaxPermSize) --> 元空间参数(MetaspaceSize MaxMetaspaceSize)



**Java8为什么要将永久代替换成元空间?**

- 字符串存在永久代中，容易出现性能问题和内存溢出
- 类及方法的信息等比较难确定大小，因此对于永久代的大小指定比较困难，太小容易出现永久代溢出，太大则容易导致老年代溢出
- 永久代会为GC带来不必要的复杂度，并且回收效率偏低
- Oracle可能会将HotSpot与JRockit合二为一，JRockit没有所谓的永久代

#### 2.1 PC程序计数器

程序计数器（program counter register）也叫作pc寄存器，是一块比较小的内存空间，它可以看做是当前线程所执行的字节码的行指示器，在虚拟机的概念模型里，字节码的解释器工作时就是通过改变这个计数器的值来选取吓一跳所需要执行的字节码指令、分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。

PC寄存器的特点：

1. 区别于计算机硬件的pc寄存器，两者略有不同，计算机使用pc寄存器来存放“伪指令”或地址，而虚拟机pc寄存器表现为一块内存，存放的是将要执行的指令的地址。
2. 当虚拟机正在执行一个本地方法的时候，jvm的pc寄存器的地址值是undefined
3. 该区域是唯一一个在java虚拟机规范中没有规定任何OutOfMemoryError情况的区域。

java虚拟机的多线程是通过线程轮流切换并分配处理器执行时间的方式来实现的，在任何一个确定的时候，一个处理器智慧执行一条线程中的指令，因此，为了线程切换后能恢复到正确的位置，每条线程都需要一个独立的程序计数器，各条线程之间的计数器互不干扰，独立存储，这类内存区域被称为**线程私有**内存。

#### 2.2 虚拟机栈

Java虚拟机栈（Java Virtual Machine Stacks)也是**线程私有**的，即生命周期和线程相同。Java虚拟机栈**和线程同时创建，用于存储栈帧**，每个方法在执行时都会创建一个**栈帧(stack frame)**，用于存储**局部变量表、操作数栈、动态链接、方法出口**等信息，每个方法从调用直到执行完成的过程就对应着一个栈帧在虚拟机栈中从入栈到出栈的过程。

#####  栈帧

栈帧（stack frame）是用于支持虚拟机进行方法调用和方法执行的数据结构，栈帧存储了方法的局部变量表、操作数栈、动态链接和方法返回地址等信息，每个方法从调用到执行的过程，都对应一个栈帧的入栈出栈。

虚拟机栈和栈帧的对应关系如下：

![image-20230216212853091](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E6%A0%88%E5%92%8C%E6%A0%88%E5%B8%A7%E7%9A%84%E5%85%B3%E7%B3%BB%E6%95%B0%E6%8D%AE.png)



###### 设置虚拟机栈的大小

-Xss为jvm启动的每个线程分配的内存大小，默认jdk1.5+是1M

##### 局部变量表

局部变量表（Local Variable Table)是一组变量值存储空间，用于存放方法参数和方法内定义的局部变量，包括8种基本数据类型，对象引用（reference类型）和returnAddress类型（指向一条字节码指令的地址）

其中64位长度的long和double类型的数据会占用两个局部变量空间（Slot），其余的数据类型只占用1个。



##### 操作数栈

操作数栈（Operand Stack），是一个后入先出栈（LIFO），随着方法执行和字节码指令的执行，会从局部变量表或对象实例的字段中复制常量或变量写入操作数栈，再随着计算的进行将栈中的元素出栈到局部变量表或者返回给方法调用者，也就是出栈/入栈操作。



##### 动态链接

Java虚拟机中，每个栈帧都包含一个指向运行时常量池中该栈所属方法的符号引用，持有这个引用的目的是为了支持方法调用过程中的动态链接（Dynamic Linking)

**动态链接的作用： 将符号引用转成直接引用**

##### 方法返回地址

方法返回地址存放调用该方法的PC寄存器的值，一个方法结束，有两种方式：

1. 程序正常执行完成。
2. 出现未处理异常非正常退出。

方法正常退出时：调用者的PC计数器的值作为返回地址，即调用该方法的指令的下一条指令地址。 

通过异常退出： 返回地址要通过异常来表达，栈帧中一般不会保存这部分信息

**无论什么方式，在方法退出后都会返回到调用处，程序才能被继续执行。**



#### 2.3 本地方法栈

本地方法栈（Native Method Stacks）与虚拟机所发挥的作用非常相似的，其区别只是虚拟机栈为虚拟机执行java方法服务，而本地方法栈则是为虚拟机所使用到的本地方法服务的。

特点：

1. 本地方法栈加载native的本地方法，native类方法存在的意义当然是填补java代码不便实现的缺陷而提出的。
2. 虚拟机栈为虚拟机执行java方法服务，而本地方法栈则是为虚拟机使用到的本地方法服务
3. 是线程私有的，它的生命周期和线程相同，每个线程都有一个

在java虚拟机规范中，对本地方法栈这块区域，与java虚拟机栈一样，定义了两种类型的异常：

1. StackOverFlowError: 线程请求的栈深度>所允许的深度
2. OutOfMemoryError: 本地方法栈扩展时无法申请到足够的内存



#### 2.3 堆

##### 2.4.1 Java堆概念

Java堆（heap）是虚拟机管理的内存中最大的一块区域，堆被**所有线程共享**，在虚拟机启动时创建。此内存区域的唯一目的就是存放对象实例，Java 世界里“几乎”所有的对象实例都在这里分配内存。“几乎”是指从实现角度来看， 随着Java语 言的发展， 现在已经能看到些许迹象表明日后可能出现值类型的支持， 即使只考虑现在， 由于即时编译技术的进步， 尤其是**逃逸分析技术**的日渐强大， **栈上分配、 标量替换优化手段**已经导致一些微妙的变化悄然发生， 所以说Java对象实例都分配在堆上也渐渐变得不是那么绝对了。  

![image-20230216214908076](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%86%85%E5%AD%98%E7%BB%93%E6%9E%84.png)

###### 堆的特点

1. 是java中虚拟机管理的最大的一块内存区域
2. 是jvm所有线程共享

**堆中包含私有的线程缓冲区 Thread Local Allocation Bugger(TLAB)**

3. 在虚拟机启动时创建
4. 唯一的目的是存放对象实例，几乎所有的对象实例及数组都在这里分配
5. Java堆是垃圾回收器管理的主要区域
6. 因此很多时候堆也被称为“GC堆”(Garbage COllected Heap),从内存回收的角度来看，由于现在收集器基本都基于分代收集算法，所以java堆可以被细分为：新生代和老年代，新生代又可分为：Eden空间，From Survivor空间，To Survivor空间
7. java堆在计算机物理存储上是不连续的、逻辑上连续，使用-Xms和-Xmx控制大小
8. 方法结束后，堆宏的对象马上移出，仅仅在gc的时候才移出
9. 如果堆中没有内存可以完成实例的分配，并且堆也无法在申请扩展时，会抛出OutOfMemoryError异常

###### 堆大小设置

内存大小： -Xmx   -Xms



###### 堆的分类

现在垃圾回收期都是分代回收，堆空间也分类如下

JDK7中：

- 年轻代

- 老年代

- 永久代

  ![image-20230216220337650](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk7%E5%A0%86%E7%A9%BA%E9%97%B4.png)

JDK8：

- 年轻代

- 老年代

  由于方法区的内存不在分配在堆上了，而是在元空间中，所有**永久代就不存在了**

![image-20230216220407104](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jdk8%E5%A0%86%E7%A9%BA%E9%97%B4.png)



##### 2.4.2 年轻代和老年代

年轻代： 主要存放新创建的对象，内存占用相对较小，垃圾回收会很频繁，年轻代划分为一个Eden Space和2个Suvivor Space(from 和to)

老年代： 主要存放生命周期比较长的对象，经历过几次年轻代gc都还存在，内存占用相对较大，垃圾回收也没有那么频繁



###### 配置新生代和老年代结构占比

默认-XX:NewRatio=2,表示新生代占1，老年代占2，新生代占整个堆的1/3

修改占比 -XX:NewPatio=4 , 标识新生代占1 , 老年代占4 , 新生代占整个堆的1/5
Eden空间和另外两个Survivor空间占比分别为8:1:1
可以通过操作选项 -XX:SurvivorRatio 调整这个空间比例。 比如 -XX:SurvivorRatio=8

在整个JVM的对象的生命历程当中，基本上对象都处于朝生夕死的状态

![image-20230216220924747](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jvm%E5%A0%86%E5%8D%A0%E6%AF%94.png)

从图中可以看出：**堆=新生代+老年代**，其中堆大小可以通过参数-Xmx -Xms指定

默认的，新生代 ( Young ) 与老年代 ( Old ) 的比例的值为 1:2 ( 该值可以通过参数 –XX:NewRatio 来指定 )，即：新生
代 ( Young ) = 1/3 的堆空间大小。老年代 ( Old ) = 2/3 的堆空间大小。其中，新生代 ( Young ) 被细分为 Eden 和 两个
Survivor 区域，这两个 Survivor 区域分别被命名为 from 和 to，以示区分。 默认的，Edem : from : to = 8 : 1 : 1 ( 可以
通过参数 –XX:SurvivorRatio 来设定 )，即： Eden = 8/10 的新生代空间大小，from = to = 1/10 的新生代空间大小。
JVM 每次只会使用 Eden 和其中的一块 Survivor 区域来为对象服务，所以无论什么时候，总是有一块 Survivor 区域
是空闲着的。因此，新生代实际可用的内存空间为 9/10 ( 即90% )的新生代空间。  



#### 2.4.3 对象分配过程

假设Java堆中间的内存是绝对规整的，分为空闲和占用，中间隔着一个指针做为分界点，那所分配内存就仅仅把这个指针向空闲的一段移动一段距离，这种分配方式被称为**指针碰撞**

如果不是规整的区域，那么虚拟机就必须记录一张表，记录哪块内存是可用的，在分配的时候找到一块可用的区域划分给对象实例，并更新记录表，这种方式被称为**空闲列表**

Java堆是否规整是由所采用的垃圾收集器是否具有压缩整理功能决定的，在使用Serial,ParNew等带有Compact过程的收集器时，通常采用指针碰撞，而使用CMS这种基于Mark-Sweep算法收集器时，通常采用空闲列表。



JVM考虑内存如何分配，在哪儿分配，并且由于内存分配算法与垃圾回收算法密切相关，因此需要考虑GC执行完毕之后是否存在内存碎片

###### 内存分配过程

1. new的对象先放在Eden伊甸园，该区域有大小限制

2. 当伊甸园填满时，程序又要创建对象，JVM的垃圾回收器将对伊甸园预期进行垃圾回收(Minor GC),将伊甸园区域中不在被其他对象引用的对象进行销毁，再加载新的对象放到伊甸园

3. 然后将伊甸园中剩余对象移动到幸存者0区

4. 如果再次触发垃圾回收，此时上次幸存下来的放在幸存者0区的，如果没有回收，就会放到幸存者1区

5. 如果再次经历垃圾回收，此时会重新返回幸存者0区，接着再去幸存者1区。

6. 如果累计次数到达默认的15次，这会进入老年代。  

   可以通过设置参数，调整阈值 -XX:MaxTenuringThreshold=N  

7. 老年代内存不足时，会再次触发full gc进行对象销毁，如果还是不足，就报OOM异常

![image-20230216221632812](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%88%86%E9%85%8D%E5%AF%B9%E8%B1%A1%E7%9A%84%E6%B5%81%E7%A8%8B%E5%9B%BE.png)



###### 对象内存布局

在HotSpot虚拟机中，对象在内存中可分为三个区域： 对象头(Header)，实例数据(Instance Data)和对齐填充(Padding)

对象头： 对象头分为两个部分

1. 用于存储对象自身的运行时数据，如hash码，GC分代年龄、锁状态标致、线程持有的锁、偏向线程ID、偏向时间戳等，这部分数据被称为**Mark Word**
2. 另一部分为指针类型，即对象指向它的雷院数据的指针，虚拟机通过这个指针来确定这个对象是那个类的实例，注意：**查找对象的元数据信息并不一定要经过对象本身**

实例数据： 是对象真正存储的有效信息，也是程序在代码中所定义的各种类型的字段信息，无论是从父类继承的，还是子类定义的，都需要记录。

对齐填充： 这部分数据并不是必须存在，也没有特别的含义，仅仅起着占位符的作用



###### 对象的访问

为了访问对象，我们的Java程序需要通过栈上的reference数据来操作堆上的具体对象，reference只是规定的一种指向对象的引用。

目前主流的访问方式有**句柄**和**直接指针**两种

句柄： Java堆中会划分一块内存作为句柄池，reference中存储的就是对象的句柄地址，而句柄中包含了对象的实例数据与类型数据各子的具体地址。

直接指针： Java堆对象的布局就必须考虑如何防止访问类型数据的相关信息，而reference存储的就是对象的地址信息。

使用句柄来访问的最大好处就是reference中存储的是稳定的句柄地址，在对象被移动（垃圾回收）时只改变句柄中的实例数据，reference不需要更改。

使用直接指针的最大好处是速度快，节省了一次指针定位的开销。





#### 2.4.4 堆GC

Java中的堆也是GC的重点工作区域，GC分为两种：一种是部分收集器(Partial GC),另一种是整堆收集器(Full GC)

部分收集器： 不是完整收集堆的收集器

- 新生代收集（Minor GC/Young GC): 只收集新生代
- 老年代收集（Major GC/ Old GC)： 只是老年代的垃圾收集（CMS GC单独回收老年代）
- 混合收集（Mixed GC): 收集整个新生代以及老年代（G1 GC会混合收集，region区域回收）
- 整堆收集（Full GC）：收集整个java堆和方法区的垃圾收集器

######  年轻代Minor GC触发条件

- 年轻代空间不足，会触发Minor GC，这里年轻代指的是Eden代满，Survivor不满不会引发GC
- Minor GC会引发STW(stop the world),暂停其他用户线程，等待垃圾回收完毕，用户线程才可以继续

###### 老年代GC（Major GC）触发条件

- 老年代空间不足时，会尝试触发Minor GC ,空间还不足就触发Major GC
- 如果Major GC后内存还是不足，就报OOM
- Major GC的速度比Minor GC慢10倍以上



###### Full GC触发条件

- 调用System.gc(),系统会执行Full GC，但是不是立即执行
- 老年代空间不足
- 方法区空间不足
- 通过Minor GC进入老年代平均大小大于老年代可用内存



#### 2.5 元空间

在JDK1.7之前，HotSpot 虚拟机把方法区当成永久代来进行垃圾回收。而从 JDK 1.8 开始，移除永久代，并把方法
区移至元空间，它位于本地内存中，而不是虚拟机内存中。 HotSpots取消了永久代，那么是不是也就没有方法区了
呢？当然不是，方法区是一个规范，规范没变，它就一直在，只不过取代永久代的是**元空间（**Metaspace**）**而已。
它和永久代有什么不同的？
**存储位置不同：**永久代**在物理上是堆的一部分**，和新生代、老年代的地址是连续的，而元空间属于**本地内存**。
**存储内容不同：**在原来的永久代划分中，永久代用来存放类的元数据信息、静态变量以及常量池等。**现在类的元信
息存储在元空间中，静态变量和常量池等并入堆中，相当于原来的永久代中的数据，被元空间和堆内存给瓜分了。**  

![image-20230218104909384](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jvm%E5%85%83%E7%A9%BA%E9%97%B4.png)



##### 2.5.1 为什么要废弃永久代，引入元空间？

相比于之前的永久代划分，Oracle为什么要这么改进呢？

- 在原来的永久代划分中，永久代需要存放类的元数据、静态变量和常量等。**它的大小不容易确定**，因为这其
  中有很多影响因素，比如类的总数，常量池的大小和方法数量等，-XX:MaxPermSize 指定太小很容易造成永久
  代内存溢出。
- 移除永久代是为融合HotSpot VM与 JRockit VM而做出的努力，因为JRockit没有永久代，不需要配置永久代
- 永久代会为GC带来不必要的复杂度，并且回收效率偏低。  

##### 2.5.2 废除永久代的好处

- 由于类的元数据分配在本地内存中，元空间的最大可分配空间就是系统可用内存空间。不会遇到永久代存在
  时的内存溢出错误。
- 将运行时常量池从PermGen分离出来，与类的元数据分开，提升类元数据的独立性。
- 将元数据从PermGen剥离出来到Metaspace，可以提升对元数据的管理同时提升GC效率  

##### 2.5.3 Metaspace相关参数

- XX:MetaspaceSize，初始空间大小，达到该值就会触发垃圾收集进行类型卸载，同时GC会对该值进行调整：如
  果释放了大量的空间，就适当降低该值；如果释放了很少的空间，那么在不超过MaxMetaspaceSize时，适当提
  高该值。

- -XX:MaxMetaspaceSize，最大空间，默认是没有限制的。如果没有使用该参数来设置类的元数据的大小，**其最
  大可利用空间是整个系统内存的可用空间**。JVM也可以增加本地内存空间来满足类元数据信息的存储。
  但是如果没有设置最大值，则可能存在bug导致Metaspace的空间在不停的扩展，会导致机器的内存不足；进
  而可能出现swap内存被耗尽；最终导致进程直接被系统直接kill掉。
  如果设置了该参数，当Metaspace剩余空间不足，会抛出：java.lang.OutOfMemoryError: Metaspace space

- -XX:MinMetaspaceFreeRatio，在GC之后，最小的Metaspace剩余空间容量的百分比，减少为分配空间所导致的
  垃圾收集

- -XX:MaxMetaspaceFreeRatio，在GC之后，最大的Metaspace剩余空间容量的百分比，减少为释放空间所导致的
  垃圾收集  



#### 2.6 方法区

###### 2.6.1 什么是方法区？

方法区（Method Area） 与Java堆一样， 是各个线程共享的内存区域，**它用于存储已被虚拟机加载 的类型信息、
常量、 静态变量、 即时编译器编译后的代码缓存等数据  **

> 《Java虚拟机规范》中明确说明：“尽管所有的方法区在逻辑上是属于堆的一部分，但些简单的实现可能不会
> 选择去进行垃圾收集或者进行压缩”。对HotSpot而言，方法区还有一个别名叫做Non-Heap（非堆），的就是
> 要和堆分开。  

[Oracle官方地址](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.5.4)

**元空间、永久代是方法区具体的落地实现。方法区看作是一块独立于Java堆的内存空间，它主要是用来存储所加载
的类信息的  **

![image-20230218105559110](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E8%BF%90%E8%A1%8C%E6%97%B6%E6%95%B0%E6%8D%AE%E5%8C%BA.png)

创建对象各数据区域的声明:

![image-20230218105634092](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%88%9B%E5%BB%BA%E5%AF%B9%E8%B1%A1%E5%90%84%E6%95%B0%E6%8D%AE%E5%8C%BA%E5%9F%9F.png)

**方法区的特点：**

- 方法区和堆一样线程共享
- 方法区在JVM启动就创建，并且物理内存上可以不连续
- 方法区的大小跟堆一样，可以选择固定或者动态变化
- 方法区的对象决定了系统可以保存多少个类，如果系统定义了太多的类，导致方法区溢出，虚拟机同样会抛出OOM（jdk7之前是PermGen Space(永久代)，jdk8之后是Metaspace(元空间))
- 关闭jvm机会释放该内存区域



###### 2.6.2 方法区结构

方法区的内部结构如下所示：

![image-20230218110038582](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E6%96%B9%E6%B3%95%E5%86%85%E9%83%A8%E7%BB%93%E6%9E%84.png)

类加载器将class文件加载到内存之后，将类的信息存储到方法区中

方法区中存储的内容：

- 类型信息（域信息，方法信息）

- 运行时常量池

  ![image-20230218110154839](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E8%BF%90%E8%A1%8C%E6%97%B6%E5%B8%B8%E9%87%8F%E6%B1%A0.png)

类型信息：

对于每个加载的类型（类Class、接口Interface、枚举enum、注解Annotation），JVM必须在方法区中存储一下类型信息

- 这个类型完整的有效名称（全名=包名.类名）
- 这个类型直接父类的完整有效名（对于interface或java.lang.Object都没有父类）
- 这个类型的修饰符（public/abstract/final的某个子集）
- 这个类型直接接口的一个有序列表



域信息：

即为类的属性、成员变量

JVM必须在方法区中保存类所有的成员变量以及声明顺序，域的相关信息包括：域名称、域类型、域修饰符（pυblic、private、protected、static、final、volatile、transient的某个子集  ）



方法信息：

JVM必须保存所有方法的以下信息，同域信息一样包括声明顺序：

1. 方法名称方法的返回类型（或void）
2. 方法参数的数量和类型（按顺序）
3. 方法的修饰符（public、private、protected、static、final、synchronized、native,、abstract的一个子集  ）
4. 方法的字节码bytecodes、操作数栈、局部变量表及大小(abstract和native方法除外)
5. 异常表（abstract和native除外），每个异常处理的开始位置，结束位置、代码处理在程序计数器上的偏移地址、被捕获的异常类的常量池索引



###### 2.6.3 方法区设置

jdk7：

- 通过-xx:Permsize来设置永久代初始分配空间。默认值是20.75M
- -XX:MaxPermsize来设定永久代最大可分配空间。32位机器默认是64M，64位机器模式是82M
- 当JVM加载的类信息容量超过了这个值，会报异常OutofMemoryError:PermGen space  

查看jdk permspace区域的默认大小

jps #显示当前所有java进程的pid

jinfo -flag PermSize 进程号 # 查看进程的PermSize初始化空间大小

jinfo -flag MaxPermSize 进程号 # 查看PermSize的最大空间



jdk8:

元数据区大小可以使用参数 -XX:MetaspaceSize 和 -XX:MaxMetaspaceSize指定

默认值依赖于平台。windows下，-XX:MetaspaceSize是21M，-XX:MaxMetaspaceSize的值是-1，即没有限制。
与永久代不同，如果不指定大小，默认情况下，虚拟机会耗尽所有的可用系统内存。如果元数据区发生溢出，虚拟
机一样会抛出异常OutOfMemoryError:Metaspace

-XX:MetaspaceSize：设置初始的元空间大小。对于一个64位的服务器端JVM来说，其默认的-xx:MetaspaceSize值为
21MB。这就是初始的高水位线，一旦触及这个水位线，FullGC将会被触发并卸载没用的类（即这些类对应的类加载
器不再存活）然后这个高水位线将会重置。新的高水位线的值取决于GC后释放了多少元空间。如果释放的空间不
足，那么在不超过MaxMetaspaceSize时，适当提高该值。如果释放空间过多，则适当降低该值。

如果初始化的高水位线设置过低，上述高水位线调整情况会发生很多次。通过垃圾回收器的日志可以观察到FullGC
多次调用。为了避免频繁地GC，建议将-XX:MetaspaceSize设置为一个相对较高的值。  

jps #显示当前所有java进程的pid

jinfo -flag MetaspaceSize进程号 # 查看进程的MetaspaceSize初始化空间大小

jinfo -flag MaxMetaspaceSize 进程号 # 查看MaxMetaspaceSize 的最大空间





#### 2.7 运行时常量池

常量池VS运行时常量池

字节码文件中包含了常量池

方法区中包含了运行时常量池

运行时常量池： 常量池表在运行时的表现形式



编译后的字节码文件包含了类型信息、域信息、方法信息等。通过ClassLoader将**字节码文件的常量池**中的信息加载到内存中，存储在**方法区的运行时常量池**中

理解为字节码的常量池Constant pool只是文件信息，它想要执行必须加载到内存，而java长须是靠JVM，更具体的来说是JVM来执行引擎解释执行的。执行引擎在运行时常量池中的数据，被加载的字节码常量池中的信息是被放到了方法区的运行时常量池中

它们不是一个概念，存放的位置是不同的，一个在字节码中，一个在方法区中

![image-20230218125946064](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E8%BF%90%E8%A1%8C%E6%97%B6%E5%B8%B8%E9%87%8F%E6%B1%A0%E7%BB%93%E6%9E%84.png)

对字节码文件反编译之后，查看常量池相关信息：

![image-20230218130031267](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%AD%97%E8%8A%82%E7%A0%81%E5%B8%B8%E9%87%8F%E6%B1%A0%E4%BF%A1%E6%81%AF.png)

要弄清楚方法区的运行时常量池，需要理解字节码中的常量池

一个有效的字节码文件中除了包括类的版本信息、字段、方法以及接口等描述信息，还包括一项信息就是**常量池表（Constant pool table)**,包括各种字面量和堆类型、域和方法的符号引用。

**常量池，可以看做是一张表，虚拟机指令根据这张表找到要执行的类名、方法名、参数类型、字面量等类型**

常量池表Contant pool table:

![image-20230218130313144](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%B8%B8%E9%87%8F%E6%B1%A0%E8%A1%A8.png)

在方法中对常量池表的符号引用：

![image-20230218130346736](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%B8%B8%E9%87%8F%E6%B1%A0%E7%9A%84%E5%BC%95%E7%94%A8.png)

**为什么需要常量池？**

将各种类型，引用转化为符号引用，具体用到的时候，再去加载。



#### 2.8 直接内存

Direct Memory直接内存，并不是虚拟机运行时数据区的一部分

在jdk1.4中加入了NIO(New Input/Output)类，引入了一个基于通道和缓存区的I/O方式，它可以使用Native函数库直接分配堆外内存，然后通过一个存储在Java堆里面的DirectByteBuffer对象作为这个内存的引用进行操作，这样能在一些场景中显著提高性能，避免了数据在Java堆和内存中来回赋值数据。

![image-20230218130710235](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E7%9B%B4%E6%8E%A5%E5%86%85%E5%AD%98%E5%BC%95%E7%94%A8%E5%85%B3%E7%B3%BB%E5%9B%BE.png)

NIO的Buwer提供一个可以直接访问系统物理内存的类——DirectBuwer。DirectBuwer类继承自ByteBuwer，但和普通的ByteBuwer不同。普通的ByteBuwer仍在JVM堆上分配内存，其最大内存受到最大堆内存的 限制。而DirectBuwer直接分配在物理内存中，并不占用堆空间。在访问普通的ByteBuwer时，系统总是会使用一个“内核缓冲区”进行操作。而DirectBuwer所处的位置，就相当于这个“内核缓冲区”。因此，使用DirectBuwer是一种更加接近内存底层的方法，所以它的速度比普通的ByteBuwer更快。  

![image-20230218130813619](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-directBuffer%E7%B1%BB%E5%9B%BE.png)

通过使用堆外内存，可以带来以下好处：

1. 改善堆过大时垃圾回收效率，减少停顿。Full GC时会扫描堆内存，回收效率和堆大小成正比。Native的内存，由OS负责管理和回收。
2. 减少内存在Native堆和JVM堆拷贝过程，避免拷贝损耗，降低内存使用。
3. 可突破JVM内存大小限制。  



### 3. 实战OutOfMemoryError异常

#### 3.1 堆溢出

堆内存中主要存放对象、数组等，只要不断地创建这些对象，并且保证 GC Roots 到对象之间有可达路径来避免垃圾收集回收机制清除这些对象，当这些对象所占空间超过最大堆容量时，就会产生 OutOfMemoryError 的异常。  

设置最大堆最小堆：-Xms20m -Xmx20m 

不断创建对象，就会提示OOM



新产生的对象最初分配在新生代，新生代满后会进行一次 Minor GC ，如果 Minor GC 后空间不足会把该对象和新生代满足条件的对象放入老年代，老年代空间不足时会进行 Full GC ，之后如果空间还不足以存放新对象则抛出 OutOfMemoryError 异常。

常见原因：

- 内存中加载的数据过多，如一次从数据库中取出过多数据；
- 集合对对象引用过多且使用完后没有清空；
- 代码中存在死循环或循环产生过多重复对象；
- 堆内存分配不合理  



#### 3.2虚拟机方法栈的溢出

达到了栈的深度而抛出的异常

出现StackOverflowError异常时， 会有明确错误堆栈可供分析， 相对而言比较容易定位到问题所在。 如果使用HotSpot虚拟机默认参数， 栈深度在大多数情况下（因为每个方法压入栈的帧大小并不是 一样的， 所以只能说大多数情况下） 到达1000~2000是完全没有问题， 对于正常的方法调用（包括不能 做尾递归优化的递归调用） ， 这个深度应该完全够用了。 但是， **如果是建立过多线程导致的内存溢 出， 在不能减少线程数量或者更换64位虚拟机的情况下， 就只能通过减少最大堆和减少栈容量来换取更多的线程。 这种通过“减少内存”的手段来解决内存溢出的方式， 如果没有这方面处理经验， 一般比 较难以想到， 这一点读者需要在开发32位系统的多线程应用时注意。 也是由于这种问题较为隐蔽**， 从 JDK 7起， 以上提示信息中“unable to create native thread”后面， 虚拟机会特别注明原因可能是“possibly out of memory or process/resource limits reached”  



#### 3.3 运行时常量池和方法区溢出

String::intern()是一个本地方法， 它的作用是如果字符串常量池中已经包含一个等于此String对象的 字符串， 则返回代表池中这个字符串的String对象的引用； 否则， 会将此String对象包含的字符串添加到常量池中， 并且返回此String对象的引用。 在JDK 6或更早之前的HotSpot虚拟机中， 常量池都是分配在永久代中， 我们可以通过-XX：PermSize和-XX： MaxPermSize限制永久代的大小， 即可间接限制其中常量池的容量 。

运行时常量池最主要的一个注意点就是在JDK6和JDK7以后有明显的区别，，是因为自JDK 7起， 原本存放在永久代的字符串常量池被移至Java堆之中， 所以在JDK 7及以上版本， 限制方法区的容量对该测试用例来说是毫无意义的 。

方法区的溢出：

方法区的其他部分的内容， 方法区的主要职责是用于存放类型的相关信息， 如类名、 访问修饰符、 常量池、 字段描述、 方法描述等。 对于这部分区域的测试， 基本的思路是运行时产 生大量的类去填满方法区， 直到溢出为止。虽然直接使用Java SE API也可以动态产生类（如反射时的 GeneratedConstructorAccessor和动态代理等）  



方法区溢出也是一种常见的内存溢出异常， 一个类如果要被垃圾收集器回收， 要达成的条件是比较苛刻的。 在经常运行时生成大量动态类的应用场景里， 就应该特别关注这些类的回收状况。 这类场 景除了之前提到的程序使用了CGLib字节码增强和动态语言外， 常见的还有： 大量JSP或动态产生JSP 文件的应用（JSP第一次运行时需要编译为Java类） 、 基于OSGi的应用（即使是同一个类文件， 被不同 的加载器加载也会视为不同的类） 等。 在JDK 8以后， 永久代便完全退出了历史舞台， 元空间作为其替代者登场。 在默认设置下， 前面列举的那些正常的动态创建新类型的测试用例已经很难再迫使虚拟机产生方法区的溢出异常了。 不过 为了让使用者有预防实际应用里出现类
似于代码清单2-9那样的破坏性的操作， HotSpot还是提供了一 些参数作为元空间的防御措施， 主要包括：

-XX： MaxMetaspaceSize： 设置元空间最大值， 默认是-1， 即不限制， 或者说只受限于本地内存 大小。

-XX： MetaspaceSize： 指定元空间的初始空间大小， 以字节为单位， 达到该值就会触发垃圾收集 进行类型卸载，同时收集器会对该值进行调整： 如果释放了大量的空间， 就适当降低该值； 如果释放 了很少的空间， 那么在不超过-XX： MaxMetaspaceSize（如果设置了的话） 的情况下， 适当提高该值。

-XX： MinMetaspaceFreeRatio： 作用是在垃圾收集之后控制最小的元空间剩余容量的百分比， 可 减少因为元空间不足导致的垃圾收集的频率。 类似的还有-XX： Max-MetaspaceFreeRatio， 用于控制最 大的元空间剩余容量的百分比。  



#### 3.4 直接内存溢出

直接内存（Direct Memory） 的容量大小可通过-XX： MaxDirectMemorySize参数来指定， 如果不去指定， 则默认与Java堆最大值（由-Xmx指定） 一致， 越过了DirectByteBuwer类直接通 过反射获取Unsafe实例进行内存分配（Unsafe类的getUnsafe()方法指定只有引导类加载器才会返回实例， 体现了设计者希望只有虚拟机标准类库里面的类才能使用Unsafe的功能， 在JDK 10时才将Unsafe 的部分功能通过VarHandle开放给外部使用） ， 因为虽然使用DirectByteBuwer分配内存也会抛出内存溢出异常， 但它抛出异常时并没有真正向操作系统申请分配内存， 而是通过计算得知内存无法分配就会 在代码里手动抛出溢出异常， 真正申请分配内存的方法是Unsafe::allocateMemory() .



由直接内存导致的内存溢出， 一个明显的特征是在Heap Dump文件中不会看见有什么明显的异常 情况， 如果发现内存溢出之后产生的Dump文件很小， 而程序中又直接或间接使用了 DirectMemory（典型的间接使用就是NIO） ，那就可以考虑重点检查一下直接内存方面的原因了。  





## 二、JVM加载机制

#### 1. 类装载子系统

##### 1.1 类加载子系统

1. 类加载子系统负责从文件系统或网诺中加载.class文件，class文件在文件开头有特定的文件标识。
2. 把加载后的class文件信息存放在方法区，除了类信息外，方法区还会存储运行时常量池信息，可能还包括字符串字面量和数字常量（这部分常量信息是class文件中常量池部分的内存映射）
3. ClassLoader只负载class文件的加载，至于是否可以运行，则由Execution Engine决定
4. 如果调用构造器实例化对象，则对象存储在堆区。

![image-20230219105958255](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%8A%A0%E8%BD%BD%E5%AD%90%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E5%9B%BE.png)

##### 1.2 类加载ClassLoader角色

1. class file 存在于本地硬盘上，可以理解为设计师画在纸上的模板，而最终这个模板在执行的时候是要加载到
   JVM当中来根据这个文件实例化出n个一模一样的实例。
2. class file 加载到JVM中，被称为DNA元数据模板。
3. 在 .class文件 --> JVM --> 最终成为元数据模板，此过程就要一个运输工具（类装载器Class Loader），扮演一个快递员的角色。  

![image-20230219110159452](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-classloader%E8%A7%92%E8%89%B2%E5%AE%9A%E4%BD%8D.png)

##### 1.3 类加载的执行过程

由.java文件编译为.class文件，.calss文件中描述了类的各种信息，最终JVM将信息加载到JVM中使用。

**类使用到的7个阶段**

类从被加载到虚拟机内存中开始、到卸载出内存，主要的生命周期包括：加载(Loading),验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initialization）、使用（Using）和卸载（UnLoading)7个阶段，其中验证、准备、解析这三个阶段统称为连接（Linking），七个阶段顺序如下：

![image-20230219110544714](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E7%9A%847%E4%B8%AA%E9%98%B6%E6%AE%B5.png)

图中**加载、验证、准备、初始化、卸载**这5个阶段顺序是确定的，类在加载必须按照这个顺序，但是解析阶段不一定：在某些情况下初始化阶段之后在开始，这是为了支持Java语言的运行时绑定（动态绑定）。

###### 加载

接在是类加载的第一个阶段，有两种机会触发类加载

1. 预加载

   虚拟机启动时加载，加载的是JAVA_HOME/lib/rt.jar中的.class文件，是一些常用的如java.lang.*,java.util.,java.io等，因此和虚拟机一起加载。

2. 运行时加载

   虚拟机在使用到一个.class文件的时候，是会先查看内存中是否加载过这个类，如果没有就按照全限定名来加载这个类

   加载阶段：

   - 获取.class文件的二进制流
   - 将类信息、静态变量、字节码、常量这些.class文件中的内容放到方法区中
   - 在内存中生成一个代码这个.class文件的java.lang.Class对象，作为方法区这个类的各种数据的访问入口，一般这个Class是在堆中，不过HotSpot虚拟机是放在方法区中的。

二进制流的来源：

- 从zip包中获取，就是jar.ear.war格式的基础
- 网诺中获取，典型应用就是Applet
- 运行时生成，动态代理技术
- 其他文件生成，JSP，由JSP生成对应的.class文件
- 从数据库读取，比较少见



###### 链接

链接包含了三个步骤： 验证、准备、解析三个过程

1. 验证

   主要是为了检测加载的二进制流是否满足虚拟机的要求，不会危害虚拟机的安全

   如：

   - 文件格式验证
   - 元数据验证
   - 字节码验证
   - 符号引用验证

2. 准备

   **准备阶段是正式为类变量分配内存并设置其初始化值的阶段，这些变量所使用的内存都将在方法区中分配**，需要注意的是：

   - 这时候进行内存分配的仅仅是类变量（static修饰的变量），而不是实例变量，实例变量会在对象实例化的时候随对象一起分配在堆中
   - 这个阶段赋初始化值的变量值的是哪些被final修饰的static变量，如"public static int value=123;",value在准备阶段后是0而不是123，给value赋值为123的冻灾将在初始化阶段才进行；比如“public static final int value=456;",这个就不一样了，在准备阶段，虚拟机就会给value=456赋值了。

   各个数据类型的零值如下表：  

| 数据类型 | 零值     |
| -------- | -------- |
| int      | 0        |
| long     | 0L       |
| short    | (short)0 |
| chart    | '\u0000' |
| byte     | (byte)0  |
| boolean  | false    |
| float    | 0.0f     |
| double   | 0.0d     |

我们顺便看一道面试题。下面两段代码，code-snippet 1 将会输出 0，而 code-snippet 2 将无法通过编译。复制code-snippet 1：  

```java
public class A {
	static int a;
	public static void main(String[] args){
		System.out.println(a)
	}
}
```



code-snippet2:

```java
public class B {
	int a;
	public static void main(String[] args){
		System.out.println(a)
	}
}
```

注意：

这里因为局部变量不像类变量那样存在准备阶段，类变量有两次赋初始值的过程，一次在准备阶段，赋予初始值（也可以是指定值）；另一次在初始化阶段，赋予程序员定义的值。

因此，即使程序员没有为类变量赋值也没有关系，它仍然有一个默认值，但是局部变量就不一样，如果没有赋值，那是不能够使用的，虚拟机会报错。



###### 解析

**解析阶段是虚拟机将常量池的符号引用替换成直接引用的过程**，了解一个符号引用和直接引用的区别：

1. 符号引用

    符号引用是一种定义，可以是任何字面上的含义，而直接引用就是指向目标的指针、相对偏移量。

   这个其实属于编译原理方面的概念，符号引用包括了下面三类常量：

   - 类和接口的全限定名
   - 字段的名称和描述符
   - 方法的名称和描述符

这么说可能不太好理解，结合实际看一下，写一段很简单的代码：  

```java
public class TestMain{
	private static int i;
    
	private double d;
	
    public static void print(){
	
	}
	
	private boolean trueOrFalse(){
		return false;
	}
}
```

使用javap反编译一下.class文件：

![image-20230219113258832](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%8F%8D%E7%BC%96%E8%AF%91%E5%90%8E%E7%9A%84%E6%96%87%E4%BB%B6%E5%86%85%E5%AE%B9.png)

看到Constant Pool也就是常量池中有22项内容，其中带"Utf8"的就是符号引用。比如#2，它的值是"com/xrq/test6/TestMain"，表示的是这个类的全限定名；又比如#5为i，#6为I，它们是一对的，表示变量时Integer（int）类型的，名字叫做i；#6为D、#7为d也是一样，表示一个Double（double）类型的变量，名字为d；\#18、#19表示的都是方法的名字。
**那其实总而言之，符号引用和我们上面讲的是一样的，是对于类、变量、方法的描述。符号引用和虚拟机的内存布局是没有关系的，引用的目标未必已经加载到内存中了**。  



2. 直接引用

直接引用可以是直接指向目标的指针、相对偏移量或是一个能间接定位到目标的句柄。直接引用是和虚拟机实现的内存布局相关的，同一个符号引用在不同的虚拟机示例上翻译出来的直接引用一般不会相同。如果有了直接引用，那引用的目标必定已经在内存中存在。

解析大概的工作：

- 类或接口的解析
- 字段解析
- 类方法解析
- 接口方法解析



###### 初始化

类初始化阶段是类加载过程的最后一步，前面的类加载过程中，除了在加载阶段用户应用程序可以通过自定义类加载器参与之外，其余都是虚拟机主导和控制，到了初始化阶段，才真正执行类中定义的Java代码或字节码。



初始化极端是执行类构造器**cinit()**方法的过程，是由编译器自动收集类中的所有类变量的赋值动作和静态语句块(static {}块)中的语句合并产生的，编译器收集的顺序是由语句在源文件中出现的顺序决定的， 静态语句块中只能访问 到定义在静态语句块之前的变量， 定义在它之后的变量， 在前面的静态语句块可以赋值， 但是不能访 问， 如代码清单7-5所示  

```java
public class Test {
	static {
		i=0; // 给变量赋值就可以正常编译通过
		System.out.print(i); // 这句编译器会提示“非法向前引用”
	}
	static int i=1;
}
```

cinit()方法与类的沟站函数（或者说实例构造器init()方法）不同，它不需要显示地调用父类构造器，虚拟机会保证子类的cinit()方法执行前，父类的cinit()已经被执行，因此在虚拟机中第一个被执行的cinit()方法的类型肯定是java.lang.Object.

由于父类的cinit()方法先执行，也就意味着父类中定义的静态语句块要先与子类的变量赋值操作，如在一下清单中，字段B的值会是2而不是1

```java
static class Parent {
	public static int A = 1;
	static {
		A = 2;
	}
}

static class Sub extends Parent{
	public static int B = A;
}

public static void main(String[] args){
	System.out.println(Sub.B);
}
```

cinit()方法对于类或接口来说并不是必须的，如果类中没有静态代码块，也没有对变量的赋值操作，那么编译器可以不生成cinit()方法

接口中不能使用静态代码块，但仍然有变量初始化的赋值操作，因此接口与类一样都会生成cinit()方法，但是接口与类不同的是，执行接口的cinit()方法不需要先执行父接口的cinit()方法，只有当父接口中定义的变量使用时，父接口才会初始化，另外，接口的实现类在初始化时也不会执行接口的cinit()方法



虚拟机会保证一个类的cinit()方法在多线程环境中被正确的加锁，同步，如果多线程同时初始化一个类，那么会只有一个线程去执行这个类的cinit()方法，其他线程都需要阻塞等待，直道活动线程执行cinit()方法完毕。



##### 1.4 cinit和init方法

区别：

```java
public class ParentA {
    static {
    	System.out.println("1");
    }
    
    public ParentA() {
        System.out.println("2");
    }
} 

class SonB extends ParentA {
    static {
    	System.out.println("a");
    } 
    public SonB() {
   		System.out.println("b");
    }

public static void main(String[] args) {
    ParentA ab = new SonB();
    ab = new SonB();
	}
}
```

执行结果：

1

a

2

b

2

b

其中 static 字段和 static 代码块，是属于类的，在类的加载的初始化阶段就已经被执行。类信息会被存放在方法区，在同一个类加载器下，这些信息有一份就够了，所以上面的 static 代码块只会执行一次，它对应的是 方法。  

![image-20230219115709296](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-cinit%E5%92%8Cinit%E5%8C%BA%E5%88%AB%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

所以，上面代码的 static 代码块只会执行一次，对象的构造方法执行两次。再加上继承关系的先后原则，不难分析出正确结果。  

结论:
cinit方法的执行时期: **类初始化阶段**(该方法只能被jvm调用, 专门承担类变量的初始化工作) ,只执行一次

init方法的执行时期: 对象的初始化阶段  



#### 2. 类加载器

##### 2.1 类加载器的作用

1. 类的加载指的是将类的.class文件中的二进制数据读入内存中，将其放在运行时数据区的方法区中，然后创建一个java.lang.Class对象，用来封装类在方法区内的数据结构

   > 注意：JVM主要在程序第一次主动使用类的时候，才会加载，并不是系统一启动的时候就将所有类信息都加载到内存，而且只需要加载一次即可。



##### 2.2 类加载器的分类

1、 jvm支持两种类型的加载器： 引导类型和自定义类加载器

2、 引导类加载器由c/c++实现，自定义类加载器由java实现

3、 jvm规范定义自定义类加载器派生于抽象类ClassLoader的类加载器

4、 按照这样的加载器的类型划分，常见的有：引导类加载器BootstrapClassLoader,自定义类加载器（Extension Class Loader、System Class Loader、User-Defined Class Loader)

![image-20230219103402985](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E7%B1%BB%E5%8A%A0%E8%BD%BD%E5%99%A8.png)

上图中的类加载器的关系为包含关系而不是继承关系



###### 启动类加载器

1. 这个类加载器是c/c++实现的，嵌套在JVM内部
2. 它是用来加载Java的核心类库(JAVA_HOME/jre/lib/rt.jar、resource.jar或sun.boot.class.path路径下的内容)，用于提供JVM自身需要的类
3. 并不继承java.lang.ClassLoader，没有父加载器

###### 扩展类加载器

1. java语言编写，由sun.misc.Launcher$ExtClassLoader实现
2. 从java.ext.dirs系统属性所指定的目录中加载类库或从JDK的安装 目录的jre/lib/ext子目录(扩展目录)xia jiazai leiku ,如果用户创建的JAR放在此目录下，也会自动由扩展类加载器加载，派生于CLassLoader
3. 父类加载器为启动类加载器

###### 系统类加载器

1. java编写，由sun.misc.Lanucher$AppClassLoader实现
2. 该类加载器是程序汇总默认的类加载器，一般java应用都由它来加载完成，负责加载环境变量classpath或系统属性java.class.path指定路径下的库,派生于ClassLoader
3. 父类加载器为扩展类加载器
4. 通过ClassLoader#getSystemClassLoader()方法获取到该类加载器



###### 自定义类加载器

在日常开发中，类加载几乎是由三种加载器配合完成，在必要时我们还可以自定义类加载器，来定制类的加载方式



#### 3. 双亲委派模型

##### 3.1 什么是双亲委派

![image-20230219121537345](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%8F%8C%E4%BA%B2%E5%A7%94%E6%B4%BE%E6%A8%A1%E5%9E%8B.png)

如图所示

双亲委派模型要求顶层的启动类加载器外，其余的类都应该有自己的父类加载器，这里类加载器的父子关系一般不会以继承的关系来实现，而是都以组合的关系来复用父加载器的代码



双亲委派模型的工作过程是：如果一个类加载器收到类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器完成。每个类加载器都是如此，只有当父加载器在自己的搜索范围内找不到指定的类时（即 ClassNotFoundException ），子加载器才会尝试自己去加载。  



##### 3.2 为什么需要双亲委派模型

假设没有双亲委派模型：

> 黑客自定义一个 java.lang.String 类，该 String 类具有系统的 String 类一样的功能，只是在某个函数稍作修改。比如 equals 函数，这个函数经常使用，如果在这这个函数中，黑客加入一些“病毒代码”。并且通过自定义类加载器加入到 JVM 中。此时，如果没有双亲委派模型，那么 JVM 就可能误以为黑客自定义的java.lang.String 类是系统的 String 类，导致“病毒代码”被执行。  

而有了双亲委派模型，黑客自定义的 java.lang.String 类永远都不会被加载进内存。因为首先是最顶端的类加载器加载系统的 java.lang.String 类，最终自定义的类加载器无法加载 java.lang.String 类。或许你会想，我在自定义的类加载器里面强制加载自定义的 java.lang.String 类，不去通过调用父加载器不就好了吗?确实，这样是可行。但是，在 JVM 中，判断一个对象是否是某个类型时，如果该对象的实际类型与待比较的类型的类加载器不同，那么会返回false。  



##### 3.3 如何实现双亲委派模型

双亲委派模型的原理很简单，实现也简单。每次通过先委托父类加载器加载，当父类加载器无法加载时，再自己加载。其实 ClassLoader 类默认的 loadClass 方法已经帮我们写好了，我们无需去写  

**几个重要的函数**

loadCLass默认实现如下：

```java
public Class<?> loadClass(String name) throws ClassNotFoundException {
	return loadClass(name, false);
}
```

loadClass(String name,boolean resolve)函数：

```java
 protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```

由代码可以看出，这个函数已经实现了双亲委派模型，大致过程如下：

1. 首先，检查一下指定名称的类是否已经加载过，如果加载过了，就不需要再加载，直接返回。  

2. 如果此类没有加载过，那么，再判断一下是否有父加载器；如果有父加载器，则由父加载器加载（即调用 parent.loadClass(name, false); ）.或者是调用 bootstrap 类加载器来加载。  
3. 如果父加载器及 bootstrap 类加载器都没有找到指定的类，那么调用当前类加载器的 findClass 方法来完成类加载。  

换句话说，如果是自定义类加载器，就必须重写**findClass**方法

findClass方法的默认实现如下：

```java
protected Class<?> findClass(String name) throws ClassNotFoundException {
    throw new ClassNotFoundException(name);
}
```

可以看出，抽象类ClassLoader的findClass函数默认是抛出异常的，前面我们知道，loadClass在父类无法加载类的时候，就会调用我们自定义的findClass函数，因此我们必须在loadClass函数里面实现一个将制定名称转换为Class对象。

如果是读取一个指定名称的类为字节数组的话，这个好办，但是如何将字节数组转为Class对象呢？java提供了**defineClass方法**，通过这个函数，就可以把字节数组转为Class对象

defineClass的主要功能：

将一个字节数组转为Class对象，这个字节数组是class文件读取后的最终的字节数组，加入class文件是加密的，需要解密之后才能使用。

```java
protected final Class<?> defineClass(String name, byte[] b, int off, int len)
throws ClassFormatError
{
return defineClass(name, b, off, len, null);
}
```

#### 4. 自定义类加载器

##### 4.1 为什么自定义类加载器

- 隔离加载类

  模块隔离，把类加载到不同的应用当中，比如tomcat这类的Web服务器，内部都定义了好鸡肋加载器，用于隔离web应用程序上的不同应用程序

- 修改类记载方式

  除了Boostrap加载器外，其他的加载并非一定要引入，根据实际情况在某个时间点按需进行动态加载

- 扩展加载源

  从数据库，网诺、其他终端上加载

- 防止源码泄漏

  java代码很容易被编译和篡改，可以进行编译加密，类加载需要自定义还原加密字节码



##### 4.2 自定义函数调用过程

过程如下：

![image-20230219124629107](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E8%87%AA%E5%AE%9A%E4%B9%89%E5%87%BD%E6%95%B0%E8%B0%83%E7%94%A8%E8%BF%87%E7%A8%8B.png)

##### 4.3 自定义类加载器的实现

实现方式：所有用户自定义的类加载器都应该继承ClassLoader类，在自定义ClassLoader的子类是，通常两种做法：

1. 重写loadClass方法（是实现双亲委派逻辑的地方，修改它会破坏双亲委派机制，不推荐）
2. 重新findClass方法，推荐使用

首先，我们定一个待加载的普通Java类：Test.java,放在com.lnlr.demo包下

```java
package com.lnlr.unit2;

public class ClassLoaderTest {
    public static void main(String[] args) {
        MyClassLoader classLoader = new MyClassLoader("d:/");
        try {
            Class<?> clazz = classLoader.loadClass("TestMain");
            System.out.println("我是由"+clazz.getClassLoader().getClass().getName()+"类加载器加载的");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}	
```

接下来就是自定义我们的类加载器：

```java
package com.lnlr.unit2;

import java.io.*;
public class MyClassLoader extends ClassLoader{
    private String codePath;
    public MyClassLoader(ClassLoader parent, String codePath) {
        super(parent);
        this.codePath = codePath;
    } 
    public MyClassLoader(String codePath) {
        this.codePath = codePath;
     } 
    @Override
	protected Class<?> findClass(String name) throws ClassNotFoundException {
        BufferedInputStream bis = null;
        ByteArrayOutputStream baos = null;
        try {
            //1.字节码路径
            String fileName = codePath+name+".class";
            //2.获取输入流
            bis = new BufferedInputStream(new FileInputStream(fileName));
            //3.获取输出流
            baos = new ByteArrayOutputStream();
            //4.io读写
            int len;
            byte[] data = new byte[1024];
            while ((len = bis.read(data)) != -1){
            	baos.write(data , 0 , len);
			} 
            //5.获取内存中字节数组
            byte[] byteCode = baos.toByteArray();
            //6.调用defineClass 将字节数组转成Class对象
            Class<?> defineClass = defineClass(null, byteCode, 0, byteCode.length);
            return defineClass;
        } catch (Exception e) {
        	e.printStackTrace();
        }finally {
            try {
            	bis.close();
            } catch (IOException e) {
            	e.printStackTrace();
         	} 
          	try {
				baos.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
		} 
        return null;
	}
}
```

#### 5. ClassLoader源码解析

##### 5.1 类的关系图

![image-20230219125512846](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-classloader%E7%B1%BB%E5%9B%BE.png)



关系类图如下：

![image-20230219125550675](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-classloader%E5%85%B3%E7%B3%BB%E7%B1%BB%E5%9B%BE.png)



##### 5.2 Launcher核心类的源码剖析

![image-20230219125651267](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-launcher.png)

我们先从启动类说起 ,有一个Launcher类 sun.misc.Launcher;  

```java
public class Launcher {
    private static URLStreamHandlerFactory factory = new Launcher.Factory();
    //静态变量,初始化,会执行构造方法
    private static Launcher launcher = new Launcher();
    private static String bootClassPath = System.getProperty("sun.boot.class.path");
    private ClassLoader loader;
    private static URLStreamHandler fileHandler;

    public static Launcher getLauncher() {
        return launcher;
    } /

    //构造方法执行
    public Launcher() {
        Launcher.ExtClassLoader var1;
        try {
            //初始化扩展类加载器
            var1 = Launcher.ExtClassLoader.getExtClassLoader();
        } catch (IOException var10) {
            throw new InternalError("Could not create extension class loader", var10);
        }
        try {
            //初始化应用类加载器
            this.loader = Launcher.AppClassLoader.getAppClassLoader(var1);
        } catch (IOException var9) {
            throw new InternalError("Could not create application class loader", var9);
        } //设置ContextClassLoader ,设置为扩展类加载器
        Thread.currentThread().setContextClassLoader(this.loader);
        String var2 = System.getProperty("java.security.manager");
        if (var2 != null) {
            SecurityManager var3 = null;
            if (!"".equals(var2) && !"default".equals(var2)) {
                try {
                    var3 = (SecurityManager) this.loader.loadClass(var2).newInstance();
                } catch (IllegalAccessException var5) {
                } catch (InstantiationException var6) {
                } catch (ClassNotFoundException var7) {
                } catch (ClassCastException var8) {
                }
            } else {
                var3 = new SecurityManager();
            }
            if (var3 == null) {
                throw new InternalError("Could not create SecurityManager: " + var2);
            }
            System.setSecurityManager(var3);
        }
    }
}
```

构造方法Launcher()做了四件事情

1. 创建扩展类加载器
2. 创建应用程序类加载器
3. 设置ContextClassLoader
4. 如果需要安装安全管理器security manager

其中launcher是staitc的,所以初始化的时候就会创建对象,也就是触发了构造方法,所以初始化的时候就会执行上面四个步骤
看下ExtClassLoader的创建中的关键几步  

```java
   static class ExtClassLoader extends URLClassLoader {
        private static volatile Launcher.ExtClassLoader instance;

        public static Launcher.ExtClassLoader getExtClassLoader() throws IOException {
            if (instance == null) {
                Class var0 = Launcher.ExtClassLoader.class;
                synchronized(Launcher.ExtClassLoader.class) {
                    if (instance == null) {
                        instance = createExtClassLoader();
                    }
                }
            }

            return instance;
        }

        private static Launcher.ExtClassLoader createExtClassLoader() throws IOException {
            try {
                return (Launcher.ExtClassLoader)AccessController.doPrivileged(new PrivilegedExceptionAction<Launcher.ExtClassLoader>() {
                    public Launcher.ExtClassLoader run() throws IOException {
                        File[] var1 = Launcher.ExtClassLoader.getExtDirs();
                        int var2 = var1.length;

                        for(int var3 = 0; var3 < var2; ++var3) {
                            MetaIndex.registerDirectory(var1[var3]);
                        }

                        return new Launcher.ExtClassLoader(var1);
                    }
                });
            } catch (PrivilegedActionException var1) {
                throw (IOException)var1.getException();
            }
        }

        void addExtURL(URL var1) {
            super.addURL(var1);
        }

        public ExtClassLoader(File[] var1) throws IOException {
            super(getExtURLs(var1), (ClassLoader)null, Launcher.factory);
            SharedSecrets.getJavaNetAccess().getURLClassPath(this).initLookupCache(this);
        }

        private static File[] getExtDirs() {
            String var0 = System.getProperty("java.ext.dirs");
            File[] var1;
            if (var0 != null) {
                StringTokenizer var2 = new StringTokenizer(var0, File.pathSeparator);
                int var3 = var2.countTokens();
                var1 = new File[var3];

                for(int var4 = 0; var4 < var3; ++var4) {
                    var1[var4] = new File(var2.nextToken());
                }
            } else {
                var1 = new File[0];
            }

            return var1;
        }

        private static URL[] getExtURLs(File[] var0) throws IOException {
            Vector var1 = new Vector();

            for(int var2 = 0; var2 < var0.length; ++var2) {
                String[] var3 = var0[var2].list();
                if (var3 != null) {
                    for(int var4 = 0; var4 < var3.length; ++var4) {
                        if (!var3[var4].equals("meta-index")) {
                            File var5 = new File(var0[var2], var3[var4]);
                            var1.add(Launcher.getFileURL(var5));
                        }
                    }
                }
            }

            URL[] var6 = new URL[var1.size()];
            var1.copyInto(var6);
            return var6;
        }

        public String findLibrary(String var1) {
            var1 = System.mapLibraryName(var1);
            URL[] var2 = super.getURLs();
            File var3 = null;

            for(int var4 = 0; var4 < var2.length; ++var4) {
                URI var5;
                try {
                    var5 = var2[var4].toURI();
                } catch (URISyntaxException var9) {
                    continue;
                }

                File var6 = Paths.get(var5).toFile().getParentFile();
                if (var6 != null && !var6.equals(var3)) {
                    String var7 = VM.getSavedProperty("os.arch");
                    File var8;
                    if (var7 != null) {
                        var8 = new File(new File(var6, var7), var1);
                        if (var8.exists()) {
                            return var8.getAbsolutePath();
                        }
                    }

                    var8 = new File(var6, var1);
                    if (var8.exists()) {
                        return var8.getAbsolutePath();
                    }
                }

                var3 = var6;
            }

            return null;
        }

        private static AccessControlContext getContext(File[] var0) throws IOException {
            PathPermissions var1 = new PathPermissions(var0);
            ProtectionDomain var2 = new ProtectionDomain(new CodeSource(var1.getCodeBase(), (Certificate[])null), var1);
            AccessControlContext var3 = new AccessControlContext(new ProtectionDomain[]{var2});
            return var3;
        }

        static {
            ClassLoader.registerAsParallelCapable();
            instance = null;
        }
    }
```

关键几步：

```java
extcl = ExtClassLoader.getExtClassLoader();

final File[] dirs = getExtDirs();

String s = System.getProperty("java.ext.dirs");
```

也在看下AppClassLoader的创建中的关键几步  

```java
/
**
* var1 类全名
* var2 是否连接该类
*/
public Class<?> loadClass(String var1, boolean var2) throws ClassNotFoundException {
    int var3 = var1.lastIndexOf(46);
    if(var3 != -1) {
        SecurityManager var4 = System.getSecurityManager();
        if(var4 != null) {
        	var4.checkPackageAccess(var1.substring(0, var3));
    	}
	}
    if(this.ucp.knownToNotExist(var1)) {
        //一般都是false，想要返回TRUE可能需要设置启动参数lookupCacheEnabled 为true。为true时，具体的逻辑也是C++写的，所以做了什么就不大清楚了。
        Class var5 = this.findLoadedClass(var1); 
        //如果这个类已经被这个类加载器加载，则返回这个类，否则返回Null
        if(var5 != null) {
    		if(var2) {
    			this.resolveClass(var5); //如果该类没有被link（连接），则连接，否则什么都不做
        	} 
   		 return var5;
    	} else {
    		throw new ClassNotFoundException(var1);
    	}
    } else {
    return super.loadClass(var1, var2);
}
```

关键步骤：

```java
this.loader = Launcher.AppClassLoader.getAppClassLoader(var1);

final String var1 = System.getProperty("java.class.path");
```

Launcher类中的静态变量

```java
private static String bootClassPath = System.getProperty("sun.boot.class.path");
```



##### 5.3 ClassLoader源码剖析

ClassLoader类，它是一个抽象类，其后所有的类加载器都继承自ClassLoader（不包括启动类加载器），这里我们主要介绍ClassLoader中几个比较重要的方法。  

![image-20230219130808682](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-classloader%E6%96%B9%E6%B3%95.png)

- loadClass(String)

该方法加载指定名称（包括包名）的二进制类型，该方法在JDK1.2之后不再建议用户重写但用户可以直接调用该方法，loadClass()方法是ClassLoader类自己实现的，该方法中的逻辑就是双亲委派模式的实现，其源码如下，loadClass(String name, boolean resolve)是一个重载方法，resolve参数代表是否生成class对象的同时进行解析相关操作。：  

```java
 protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            // 先从缓存查找该class对象，找到就不用重新加载
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        // 找不到，委托父类加载器加载
                        c = parent.loadClass(name, false);
                    } else {
                        // 没有父类，则委托启动类加载器加载
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // ClassNotFoundException thrown if class not found
                    // from the non-null parent class loader
                }

                if (c == null) {
                    // If still not found, then invoke findClass in order
                    // to find the class.
                    // 通过自己实现的findClass去查找并加载
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                // 是否需要在加载时进行解析
                resolveClass(c);
            }
            return c;
        }
    }
```

使用指定的二进制名称来加载类，这个方法的默认实现按照以下顺序查找类：

 调用findLoadedClass(String)方法检查这个类是否被加载过 

使用父加载器调用loadClass(String)方法，如果父加载器为Null，类加载器装载虚拟机内置的加载器调用findClass(String)方法装载类，

 如果，按照以上的步骤成功的找到对应的类，并且该方法接收的resolve参数的值为true,那么就调用resolveClass(Class)方法来处理类。

 ClassLoader的子类最好覆盖findClass(String)而不是这个
方法。 除非被重写，这个方法默认在整个装载过程中都是同步的（线程安全的）  



- findClass(String)

  在JDK1.2之前，在自定义类加载时，总会去继承ClassLoader类并重写loadClass方法，从而实现自定义的类加载类，但是在JDK1.2之后已不再建议用户去覆盖loadClass()方法，而是建议把自定义的类加载逻辑写在findClass()方法中，从前面的分析可知，findClass()方法是在loadClass()方法中被调用的，当loadClass()方法中父加载器加载失败后，则会调用自己的findClass()方法来完成类加载，这样就可以保证自定义的类加载器也符合双亲委托模式。需要注意的是ClassLoader类中并没有实现findClass()方法的具体代码逻辑，取而代之的是抛出ClassNotFoundException异常，同时应该知道的是findClass方法通常是和defineClass方法一起使用的
  ClassLoader类中findClass()方法源码如下：  

```java
protected Class<?> findClass(String name) throws ClassNotFoundException {
	throw new ClassNotFoundException(name);
}
```

- defineClass(byte[] b, int ow, int len  )

  defineClass()方法是用来将byte字节流解析成JVM能够识别的Class对象
  (defineClass中已实现该方法逻辑)，通过这个方法不仅能够通过class文件实例化class对象，也可以通过其他方式实例化class对象，如通过网络接收一个类的字节码，然后转换为byte字节流创建对应的Class对象，defineClass()方法通常与findClass()方法一起使用，一般情况下，在自定义类加载器时，会直接覆盖ClassLoade  的findClass()方法并编写加载规则，取得要加载类的字节码后转换成流，然后调用defineClass()方法生成类的Class对象，简单例子如下：  

```java
protected Class<?> findClass(String name) throws ClassNotFoundException {
    // 获取类的字节数组
    byte[] classData = getClassData(name);
    if (classData == null) {
    	throw new ClassNotFoundException();
    } else {
        //使用defineClass生成class对象
        return defineClass(name, classData, 0, classData.length);
    }
}
```

需要注意的是，如果直接调用defineClass()方法生成类的Class对象，这个类的Class对象并没有解析(也可以理解为链接阶段，毕竟解析是链接的最后一步)，其解析操作需要等待初始化阶段进行。  

- resolveClass(Class<?> c)

  使用该方法可以使用类的Class对象创建完成也同时被解析。前面我们说链接阶段主要是对字节码进行验证，为类变量分配内存并设置初始值同时将字节码文件中的符号引用转换为直接引用。  

  



## 三、垃圾回收机制及算法

### 1.垃圾回收概述

Carbage Collection,GC是历史比Java悠久，1960年诞生于MIT的Lisp是第一门真正使用动态分配和垃圾回收技术的语言。

GC需要考虑的三件事情：

- 哪些内存需要回收
- 什么时候回收
- 如何回收

GC的优缺点：

- 优点
  - 不需要考虑内存管理
  - 可以有效防止内存泄漏，有效利用可用内存
  - 由于有GC，java中的对象不再有“作用域”的概念，只有对象的引用才有“作用域”
- 缺点
  - java开发人员不了解内存管理

### 2. 对应是否已死

#### 2.1 如何判断对象是否存活- 引用计数法

给对象添加一个引用计数器，每一个地方引用，计数器+1，引用失效，计数器-1，任何时刻计数器为0的对象就不能再被使用。但是对于java虚拟机来说，并不是一个好的选择，因为它很难**解决循环引用的问题**

优点： 实现简单高效，很好的和程序交织

缺陷：无法解决循环引用问题

#### 2.2 如何判断对象是否存活- 可达性分析算法

算法基本思路： 通过一系列的称为**GC Roots**的对象作为起始点，从这些节点开始向下搜索，搜索走过的路径称为引用链（Reference Chain），当一个对象到GC Roots没有任何引用链相连（用图论来说，就是从GC Roots到这个对象不可达）时，说明这个对象是不可用的。

![image-20230219181238640](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%8F%AF%E8%BE%BE%E6%80%A7%E5%88%86%E6%9E%90%E7%AE%97%E6%B3%95%E6%A6%82%E5%BF%B5.png)

在Java语言中，可作为GC Roots的对应包括下面几种：

- 虚拟机栈（栈帧中的本地变量表）中的引用

- 方法区中类静态属性引用的对象

- 方法区中常量引用的对象

- 本地方法栈中JNI（一般说的是Native方法） 引用的对象

- Java虚拟机内部的引用，如基于数据类型对应的Class对象，一些常驻的异常对象（如NullPointException,OutOfMemeoryError)，还有系统类加载器

- 所有被同步锁（synchronized关键字）持有的对象

- 反映虚拟机内部情况的JMXBean,JVMTI中注册回调、本地代码缓存等

  ![image-20230219181553516](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-javamemorymodel.png)

  从上图，reference1,reference2,referece3都是GC Roots,可以看出

  - reference1--->对象实例1
  - reference2--->对象实例2
  - reference3--->对象实例4
  - reference3--->对象实例4--->对象实例6

#### 2.3 再谈引用

当内存空间还足够时，则能保留在内存之中，如果内存空间在进行垃圾回收后还是非常紧张，则可以被抛弃，很多系统的缓存功能都符合这样的场景。

Java对引用的概念进行扩充，将引用分为四类：

- 强引用（Strong Reference）： 在程序代码中普遍存在，类似“Object obj = new Object()"，只要引用还在，垃圾回收器永远不会回收掉被引用的对象
- 软引用（Soft Reference）：描述一些还有用但是非必需的对象，对于软引用关联的对象，在系统即将要发生OOM之前，将会把这些对象列进回收返回之中进行二次回收，如果回收后还是不满足内存，就抛出OOM。SoftReference类实现软引用
- 弱引用（Weak Reference): 也是用来描述非必需对象的，但是比软引用更弱，被引用的对象只能生存到下一次垃圾回收发生之前，当垃圾回收器工作时，无论对象是否足够，都会回收掉只被弱引用关联的对象，WeakReference类来实现弱引用
- 虚引用（Phantom Reference）：也称为幻影引用/幽灵引用，唯一的目的在这个对象被垃圾回收器收回时收到一个通知，PhantomReference类来实现虚引用

弱引用与软引用的区别在于：  

1. 更短暂的生命周期
2. 一旦发现了具有弱引用的对象，无论空间是否足够，都会被回收

虚引用与软引用和弱引用的一个区别在于：  

1. 虚引用必须和引用队列（ReferenceQueue)联合使用
2. 当垃圾回收器准备收回一个对象时，如果发现它还有虚引用，就会在回收对象的内存之前，把这个虚引用加入到与之关联的引用队列中。

#### 2.4 生存还是死亡

即使在可达性分析算法中不可达的对象，也并非是“非死不可”的，这个时候他们暂时处于“缓刑”阶段，要真正的宣告一个对象的私网，至少要经历两次标记过程。

##### 第一次标记

如果对象在进行可达性分析后发现没有与GC Roots相连接的引用链，那么它将会被第一次标记并且进行一次筛选，筛选的条件是**此对象是否有必要执行finalize()方法**

**没有必要**：对象没有覆盖finalize()方法，或者finalize()方法已经被虚拟机调用过，那么虚拟机将这两种情况视为**没有必要**

**有必要**：如果这个对象被判定为由必要执行finalize()方法，那么这个对象会被放到一个**F-Queue**队列中，并且稍后由一个虚拟机自动建立的、低调低优先级的Finalizer线程去执行它的fianalize()方法，finalize()方法是对象最后一次逃脱死亡的机会，稍后GC将会F-Queue中的对象进行**第二次小规模**的标记，如果对象要在finalize方法中拯救自己，**只需要与引用链上的任何一个对象建立关联即可，比如把自己（this)赋值给某个类变量或者对象的成员变量**，那么在第二次标记时它将被移出**即将回收**的集合，如果这个时候还是没有被移出，那么就基本真的要被回收了。

![image-20230219183847826](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%AF%B9%E8%B1%A1%E6%98%AF%E5%90%A6%E7%9C%9F%E7%9A%84%E7%A7%81%E7%BD%91%E9%80%BB%E8%BE%91%E5%9B%BE.png)

一个对象自我拯救的演示：

```java
/**
* 此代码演示了两点：
* 1.对象可以在被GC时自我拯救。
* 2.这种自救的机会只有一次， 因为一个对象的finalize()方法最多只会被系统自动调用一次
*/
public class FinalizeEscapeGC {
    public static FinalizeEscapeGC SAVE_HOOK = null;
    
    public void isAlive() {
        System.out.println("yes, i am still alive :)");
    }
    
    @Override
    protected void finalize() throws Throwable {
        super.finalize();
        System.out.println("finalize method executed!");
        FinalizeEscapeGC.SAVE_HOOK = this;
    } 
    public static void main(String[] args) throws Throwable {
        SAVE_HOOK = new FinalizeEscapeGC();
        //对象第一次成功拯救自己
        SAVE_HOOK = null;
        System.gc();
        // 因为Finalizer方法优先级很低， 暂停0.5秒， 以等待它
        Thread.sleep(500);
        if (SAVE_HOOK != null) {
       		SAVE_HOOK.isAlive();
        } else {
        	System.out.println("no, i am dead :(");
        } 
        //下面这段代码与上面的完全相同，但是这次自救却失败了
        SAVE_HOOK = null;
        System.gc();
        // 因为Finalizer方法优先级很低， 暂停0.5秒， 以等待它
        Thread.sleep(500);
        if (SAVE_HOOK != null) {
        	SAVE_HOOK.isAlive();
        } else {
       		System.out.println("no, i am dead :(");
        }
	}
}
```

运行结果：

```
finalize method executed!
yes, i am still alive :)
no, i am dead :(
```

**注意：**

SAVE_HOOK对象的finalize方法确实被GC收集器触发过，并且在收集前成功逃脱了

任何对象的finalize()方法都会被系统系统调用一次，如果对象面临下一次回收，它的finalize方法是不会被再次执行，因此第二段代码的自救行动失败了。



Finalizer线程去执行它们的finalize() 方法, 这里所说的“执行”是指虚拟机会触发这个方法开始运行， 但并不承诺一定会等待它运行结束。 这样做的原因是， 如果某个对象的finalize()方法执行缓慢， 或者更极端地发生了死循环， 将很可能导 致F-Queue队列中的其他对象永久处于等待， 甚至导致整个内存回收子系统的崩溃。  



### 3. 垃圾收集算法

#### 3.1 分代收集理论

程序运行实际情况的经验法则， 它建立在两个分代假说之上：
1） 弱分代假说（Weak Generational Hypothesis） ： 绝大多数对象都是朝生夕灭的。
2） 强分代假说（Strong Generational Hypothesis） ： 熬过越多次垃圾收集过程的对象就越难以消亡  

在Java堆划分出不同的区域之后， 垃圾收集器才可以每次只回收其中某一个或者某些部分的区域 ——因而才有了“Minor GC”“Major GC”“Full GC”这样的回收类型的划分； 也才能够针对不同的区域安 排与里面存储对象存亡特征相匹配的垃圾收集算法——因而发展出了“标记-复制算法”“标记-清除算 法”“标记-整理算法”等针对性的垃圾收集算法。
他针对不同分代的类似名词， 为避免产生混淆， 在这里统一定义 :  

- 部分收集（Partial GC） ： 指目标不是完整收集整个Java堆的垃圾收集， 其中又分为：  
  - 新生代收集（Minor GC/Young GC): 目标只是新生代的垃圾收集
  - 老年代收集（Majar GC/Old GC): 目标只是老年代的垃圾收集，目前只有CMS收集器会有单独收集老年代的行为
  - 混合收集（Mixed GC): 指目标是收集整个新生代以及部分老年代的垃圾收集。 目前只有G1收集器会有这种行为。  
- 整堆收集（Full GC）： 收集整个Java堆和方法区的垃圾收集



#### 3.2 标记-清除算法

算法分为“标记”和“清除”两个阶段：首先标记出所有需要回收的对象，在标记完成之后统一回收所有被标记的对象。

![image-20230219192038191](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E6%A0%87%E8%AE%B0%E6%B8%85%E9%99%A4%E7%AE%97%E6%B3%95.png)

主要有两个问题：

1. 效率问题

   标记和清除两个过程的效率都不高，执行效率不稳定，标记和清除的执行效率随着对象的增长而降低的。

2. 空间问题

   标记清除之后会产生大量不连续的内存碎片，空间碎片太多可能会导致以后在程序运行中需要分配较大的对象时，无法找到足够大的内存不得不提前触发另一次垃圾收集动作。



#### 3.3 复制算法

为了解决效率问题，复制算法出现了，它将可用的内存容量划分为大小相同的两块，每次使用其中一块，当这块用完了，就将还存活的对象复制到另一块上面，然后将本次这块全部清理干净，这样使得每次是对整个半区进行内存回收，内存分配时也不需要在考虑内存碎片等复杂情况。只要移动堆顶指针，按顺序分配即可。

![image-20230219192706272](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%A4%8D%E5%88%B6%E7%AE%97%E6%B3%95.png)

算法缺点：

1. 需要提前预留一般区域来存放活着的对象，导致内存可用区域减少一般，总体GC更频繁
2. 如果出现存活的对象较多的时候，需要复制较多对象，成本上升、效率降低
3. 如果99%的对象都是存活(老年代中)，那么是无法使用这种算法的

注意事项：

目前大多数商用虚拟机都采用这种复制算法来收集**新生代**，研究表明98%的对象都是**朝生夕死**，所以并不需要按照1:1的关系来划分空间，将内存划分为一块较大的Eden和两块较小的survivor空间。

按照8:1:1的划分比例，那么每次新生代的可用空间为整个新生代容量的90%（80%+10%），只有10%的内存会被浪费



#### 3.4 标记-整理算法

标记-复制算法在对象存活较高的时候就需要进行较多的复制操作，效率会大大降低，所以老年代不采用这种算法。

老年代被提出一种**标记-整理**算法，其中标记过程仍然和“标记-清除”算法一致，单后续步骤不是对可回收对象进行清理，而是让所有存活的对象都向内存空间的一端移动，然后清理掉边界以外的内存。

标记-清除算法和标记-整理算法本质差异在于前者是一种非移动式的回收算法，而后者是移动式的，是否移动回收后的存活对象是一项优缺点并存的风险决策：

![image-20230219193540306](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E6%A0%87%E8%AE%B0%E6%95%B4%E7%90%86%E7%AE%97%E6%B3%95.png)

#### 算法总结

当前商业虚拟机的垃圾收集算法都采用**分代收集**算法，一般把堆分为新生代和老年代，在新生代中每次垃圾收集时都发现大量对象已死，只有少量存活，那么采用**复制算法**，只需要复制少量的对象就可以完成收集。而老年代因为对象存活率高，没有额外的控件对它进行分配担保，就必须使用**标记-清理或标记-整理**算法来记性回收，一般采用标记-整理算法。

#### 3.5 HotSpot的算法实现

1. 枚举根节点

   虚拟机通过一组称为OopMap的数据结构来得到哪些地方存放着对象引用

2. 安全点

   在一些特定的位置记录了对象引用信息，这些特定地方被称为**安全点**

3. 安全区域

   安全区域是在一段代码片段中，引用关系不会发生变化，这个区域的任何地方开始GC都是安全的（如线程处于Sleep或Blocked状态）

### 4. 垃圾收集器

垃圾收集器就是垃圾回收的具体实现，不同厂商、不同版本的虚拟机提供的垃圾收集器都可能有很大的差别，在HotSpot JDK1.7 Update14之后正式提供了商用的G1收集器。

#### 4.1 垃圾回收器的分类

![image-20230219194639558](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8%E7%9A%84%E5%88%86%E7%B1%BB.png)

##### 串行垃圾回收（Serial收集）

串行垃圾回收是为单线程环境设计且只使用一个线程进行垃圾回收，会暂停所有的用户线程，不适合交互性强的服务器环境  

![image-20230219194944663](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E4%B8%B2%E8%A1%8C%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6.png)

##### 并行垃圾回收（Parallel  ）

多个垃圾收集器线程并行工作，同样会暂停用户线程，适用于科学计算、大数据后台处理等多交互场景。  

![image-20230219195033047](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%B9%B6%E8%A1%8C%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6.png)

##### 并发垃圾回收（CMS）

用户线程和垃圾回收线程同时执行，不一定是并行的，可能是交替执行，可能一边垃圾回收，一边运行应用线程，不需要停顿用户线程，互联网应用程序中经常使用，适用对响应时间有要求的场景。  

![image-20230219195116366](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%B9%B6%E8%A1%8C%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6.png)

##### G1垃圾回收

G1垃圾回收器将堆内存分割成不同的区域然后并发地对其进行垃圾回收  



###### 七种垃圾收集器及其组合关系  

根据分代思想，我们有7种主流的垃圾回收器  

![image-20230219195229553](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-7%E7%A7%8D%E4%B8%8D%E5%90%8C%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8%E7%BB%84%E5%90%88%E5%85%B3%E7%B3%BB.png)

新生代垃圾收集器：Serial 、 ParNew 、Parallel Scavenge
老年代垃圾收集器：Serial Old 、 Parallel Old 、CMS
整理收集器：G1  



垃圾收集器的组合关系  

![image-20230219195324703](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%9E%83%E5%9C%BE%E6%94%B6%E9%9B%86%E5%99%A8%E7%9A%84%E7%BB%84%E5%90%88%E5%85%B3%E7%B3%BB.png)

JDK8中默认使用组合是: Parallel Scavenge GC 、ParallelOld GC  

JDK9默认是用G1为垃圾收集器
JDK14 弃用了: Parallel Scavenge GC 、Parallel OldGC
JDK14 移除了 CMS GC  

###### GC性能指标

吞吐量：即CPU用于运行用户代码的时间与CPU总消耗时间的比值（吞吐量 = 运行用户代码时间 / ( 运行用户代码时间 + 垃圾收集时间 )）。例如：虚拟机共运行100分钟，垃圾收集器花掉1分钟，那么吞吐量就是99%
暂停时间：执行垃圾回收时，程序的工作线程被暂停的时间
内存占用：java堆所占内存的大小
收集频率：垃圾收集的频次  



#### 4.2 Serial收集器

单线程收集器，“单线程”的意义不仅仅说明它只会使用一个CPU或一个收集线程去完成垃圾收集工作；
更重要的是它在垃圾收集的时候，必须暂停其他工作线程，直到垃圾收集完毕；  

这个收集器是一个单线程工作的收集器， 但它的“单线 程”的意义并不仅仅是说明它只会使用一个处理器或一条收集线程去完成垃圾收集工作， 更重要的是强 调在它进行垃圾收集时， 必须暂停其他所有工作线程， 直到它收集结束。 “Stop The World”这个词语也 许听起来很酷， 但这项工作是由虚拟机在后台自动发起和自动完成的， 在用户不可知、 不可控的情况 下把用户的正常工作的线程全部停掉， 这对很多应用来说都是不能接受的。
**示意了Serial/Serial Old收 集器的运行过程  **

![image-20230219195709470](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-serial%E6%94%B6%E9%9B%86%E5%99%A8%E7%9A%84%E8%BF%90%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

Serial收集器也并不是只有缺点；Serial收集器由于简单并且高效；
对于单CPU环境来说，由于Serial收集器没有线程间的交互，专心做垃圾收集自然可以做获得最高的垃圾收集效率
使用方式：-XX:+UseSerialGC  



#### 4.3 ParNew收集器

ParNew收集器实质上是Serial收集器的多线程并行版本， 除了同时使用多条线程进行垃圾收集之 外， 其余的行为包括Serial收集器可用的所有控制参数 、 收集算法、 Stop The World、 对象分配规则、 回收策略等都与Serial收集器完全一致， 在实现上这两种收集器也共用了相当多的代码.  

**ParNew收集器运行过程**

![image-20230219195914240](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-parnew%E6%94%B6%E9%9B%86%E5%99%A8%E8%BF%90%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

ParNew收集器在单CPU服务器上的垃圾收集效率绝对不会比Serial收集器高；但是在多CPU服务器上，效果会明显比Serial好
使用方式：-XX:+UseParNewGC
设置线程数: XX:ParllGCThreads  



#### 4.4 Parallel Scavenge收集器

为吞吐量优先收集器，和ParNew收集器类似，是一个**新生代收集器**。使用复制算法的并行多线程收集器。Parallel Scavenge是Java1.8默认的收集器，特点是并行的多线程回收，以吞吐量优先。  

特点：

- Parallel Scavenge收集器的目标是达到一个可控制的吞吐量（Throughput）；
  吞吐量=运行用户代码时间/(运行用户代码时间+垃圾收集时间) 
- 自适应调节策略，自动指定年轻代、eden，survivor区的比例

使用的场景：

适合后台运算，交互不多的任务，如批量处理，订单处理，科学计算等。  

参数：

- 使用方式：-XX:+UseParallelGC  

- 分别是控制:最大垃圾收集停顿时间-XX:MaxGCPauseMillis  

  -XX： MaxGCPauseMillis参数允许的值是一个大于0的毫秒数， 收集器将尽力保证内存回收花费的时间不超过用户设定值。 不过大家不要异想天开地认为如果把这个参数的值设置得更小一点就能使得系统的垃圾收集速度变得更快， 垃圾收集停顿时间缩短是以牺牲吞吐量和新生代空间为代价换取的：系统把新生代调得小一些， 收集300MB新生代肯定比收集500MB快， 但这也直接导致垃圾收集发生得更频繁， 原来10秒收集一次、 每次停顿100毫秒， 现在变成5秒收集一次、 每次停顿70毫秒。 停顿时间
  的确在下降， 但吞吐量也降下来了。  

- 吞吐量大小-XX:GCTimeRatio  

  -XX： GCTimeRatio参数的值则应当是一个大于0小于100的整数， 也就是垃圾收集时间占总时间的比率， 相当于吞吐量的倒数。 假设GCTimeRatio的值为n，那么系统将花费不超过1/(1+n)的时间用于垃圾收集。譬如把此参数设置为19， 那允许的最大垃圾收集时间就占总时间的5%（即1/(1+19)） ， 默认值为99， 即允许最大1%（即
  1/(1+99)） 的垃圾收集时间  

- 设置年轻代线程数 XX:ParllGCThreads  

  当cpu合数小于等于8,默认cpu核数相同; 当cpu核数超过8, ParllGCThreads设置为 3+(5*CPU_COUNT)/8  

- -XX:+UseAdaptiveSizePolicy  

  设置之后，不要手工指定年轻代、Eden、Suvisor区的比例，晋升老年代的对象年龄等，因为**虚拟机会根据系统运行情况进行自适应调节**  



#### 4.5 Serial Old收集器

Serial Old是Serial收集器的老年代版本， 它同样是一个单线程收集器， 使用标记-整理算法。 这个收集器的主要意义也是供客户端模式下的HotSpot虚拟机使用。  

特点：

- 针对老年代
- 采用**标记-整理**算法
- 单线程收集

执行流程：

![image-20230219200607187](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-seria%20old%E6%89%A7%E8%A1%8C%E6%B5%81%E7%A8%8B.png)

应用场景: 主要用于Client模式  

1）在JDK1.5及之前，与Parallel Scavenge收集器搭配使用（JDK1.6有Parallel Old收集器可搭配）；
2）作为 CMS收集器的后备预案 ，在并发收集发生Concurrent Mode Failure时使用  

参数设置：
使用方式：-XX:+UseSerialGC

注意事项：
需要说明一下， Parallel Scavenge收集器架构中本身有PS MarkSweep收集器来进行老年代收集， 并非直接调用Serial Old收集器， 但是这个PS MarkSweep收集器与Serial Old的实现几乎是一样的， 所以在官方的许多资料中都是直接以Serial Old代替PS MarkSweep进行讲解.  



#### 4.6 Parallel  Old收集器

Parallel Old是Parallel Scavenge收集器的老年代版本， 支持多线程并发收集， 基于标记-整理算法实现。 这个收集器是直到JDK 6时才开始提供的， 在此之前， 新生代的Parallel Scavenge收集器一直处于相 当尴尬的状态， 原因**是如果新生代选择了Parallel Scavenge收集器， 老年代除了Serial Old（PS MarkSweep） 收集器以外别无选择， 其他表现良好的老年代收集器， 如CMS无法与它配合工作。  **

Parallel Old运行过程：

![image-20230219200841173](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-parallel%20old%E8%BF%90%E8%A1%8C%E8%BF%87%E7%A8%8B.png)

应用场景
JDK1.6及之后用来代替老年代的Serial Old收集器；
特别是在Server模式，多CPU的情况下；
这样在注重吞吐量以及CPU资源敏感的场景，就有了Parallel Scavenge加Parallel Old收集器的"给力"应用组合；

3.设置参数
"-XX:+UseParallelOldGC"：指定使用Parallel Old收集器；  

#### 4.7 CMS收集器

CMS（concurrent mark sweep）是以获取最短垃圾收集停顿时间为目标的收集器，CMS收集器的关注点尽可能缩短垃圾收集时用户线程的停顿时间,停顿时间越短就越适合与用户交互的程序,目前很大一部分的java应用在互联网的B/S系统服务器上，这类应用尤其注重服务器的响应速度，系统停顿时间最短，给用户带来良好的体验，**CMS收集器使用的算法是标记-清除算法实现的；  **

###### CMS垃圾收集过程

1. 初始标记
2. 并发标记
3. 重新标记
4. 并发清除

其中**初始标记和重新标记**都需要Stop The World

cms运行示意：

![image-20230219201145281](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-cms%E8%BF%90%E8%A1%8C%E5%9B%BE.png)

CMS整个过程比之前的收集器要复杂,整个过程分为4个阶段即、初始标记 并发标记 、重新标记、并发清除 

- 初始标记（Initial-Mark）阶段：这个阶段程序所有的工作线程都将会因为"Stop-the-Wold"机制而出现短暂的的暂停,这个阶段的主要任务标记处GC Roots 能够关联到的对象.一旦标记完成后就恢复之前被暂停的的所有应用。 由于直接关联对象比较小，所以这里的操作速度非常快。
- 并发标记（Concurrent-Mark）阶段：从GC Roots的直接关联对象开始遍历整个对象图的过程,这个过程耗时较长,但是不需要暂停用户线程, 用户线程可以与垃圾回收器一起运行。
- 重新标记（Remark）阶段：由于并发标记阶段，程序的工作线程会和垃圾收集线程同时运行或者交叉运行，因此，为了修正并发标记期间因为用户继续运行而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间通常比初始标记阶段长一些，但也远比并发标记阶段时间短。
- 清除并发（Concurrent-Sweep）阶段: 此阶段清理删除掉标记判断已经死亡的对象,并释放内存空间。由于不需要移动存活对象，所以这个阶段可以与用户线程同时并发运行。

由于最消耗事件的并发标记与并发清除阶段都不需要暂停工作，因为整个回收阶段是低停顿（低延迟）的  



##### 三个明显的缺点

- CMS收集器对CPU资源非常敏感

- CMS收集器无法处理浮动垃圾，可能出现"Concurrent Mode Failure"失败而导致另一次Full GC的产生。  

  收集过程中，还伴随有垃圾不断产生，CMS无法在当次处理掉他们，只有下一次GC时才处理，这部分垃圾就称为**浮动垃圾**

- 空间碎片:CMS是一款基于标记-清除算法实现的收集器，所有会有空间碎片的现象。  



#### 4.8 G1收集器

Garbage First是一款面向服务端应用的垃圾收集器，主要针对配备多核CPU及大容量内存的机器，以极高概率满足GC停顿时间的同时，还兼具高吞吐量的性能特征。是当今收集器最前沿成果之一。

##### 4.8.1 G1收集器的特点

1. G1把内存划分为多个独立的区域Region
2. G1仍然保留分代思想,保留了新生代和老年代,但他们不再是物理隔离,而是一部分Region的集合
3. G1能够充分利用多CPU、多核环境硬件优势，尽量缩短STW
4. G1整体整体采用标记整理算法,局部是采用复制算法,不会产生内存碎片
5. G1的停顿可预测,能够明确指定在一个时间段内,消耗在垃圾收集上的时间不超过设置时间
6. G1跟踪各个Region里面垃圾的价值大小,会维护一个优先列表,每次根据允许的时间来回收价值最大的区域,从而保证在有限事件内高效的收集垃圾  

归纳为：

- 并发与并行
- 分代收集
- 空间整合
- 可预测的停顿



##### 4.8.2 Region区域

G1不再坚持固定大小以及固定数量的 分代区域划分， 而是把连续的Java堆划分为多个独立区域（Region） ， 每一个Region都可以 根据需要， 扮演新生代的Eden空间、 Survivor空间， 或者老年代空间。  

![image-20230219202124738](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%E6%94%B6%E9%9B%86%E5%99%A8region%E5%8C%BA%E5%9F%9F.png)

（1）将整个堆空间细分为若干个小的区域。
    ①使用G1收集器时，它将整个Java堆划分成约2048个大小相同的独立Region块，每个Region块大小根据堆空间的实际大小而定，为2的N次幂，即1MB, 2MB, 4MB, 8MB, 16MB,32MB。
    ② 虽然还保留有新生代和老年代的概念，但新生代和老年代不再是物理隔离的了,它们都是一部分Region (不需要连续)的集合。通过Region的动态分配方式实现逻辑上的连续。
    ③ G1垃圾收集器还增加了一种新的内存区域，叫做Humongous内存区域，如图中的H块。主要用于存储大对象，如果超过1 .5个region,就放到H。一般被视为老年代.  

##### 4.8.3 G1 GC 过程

G1提供了两种GC模式，Young GC和Mixed GC，两种均是完全Stop The World的。  

- Young GC：选定所有年轻代里的Region。通过控制年轻代的region个数，即年轻代内存大小，来控制young GC的时间开销。  
- Mixed GC：选定所有年轻代里的Region，外加根据global concurrent marking统计得出收集收益高的若干老年代Region。在用户指定的开销目标范围内尽可能选择收益高的老年代Region。  

在G1垃圾回收的过程一共有四个阶段：

1. 初始标记： 和CMS一样只标记GC Roots直接关联的对象
2. 并发标记： 进行GC Rootss Traceing的过程
3. 最终标记： 修正并发标记期间，因为程序运行导致发生变化的那一部分对象
4. 筛选回收： 根据时间来进行价值最大化收集

G1收集示意图：

![image-20230219202736737](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%E6%94%B6%E9%9B%86%E7%A4%BA%E6%84%8F%E5%9B%BE.png) 

> G1 YoungGC

堆分为大约2000个区域。最小大小为1Mb，最大大小为32Mb。蓝色区域保存老年代对象，绿色区域保存年轻对象。  

![image-20230219202937633](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%20younggc.png)

> 执行YoungGC

将存活的对象（即复制或移动）到一个或多个幸存者区域。如果满足老化阈值，则某些对象将被提升到老年代区域。  

![image-20230219203022762](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%20%E6%89%A7%E8%A1%8C%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

> G1的年轻GC结束

![image-20230219203111286](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%E7%9A%84%E5%B9%B4%E8%BD%BBgc%E7%BB%93%E6%9D%9F.png)

最近升级的对象以深蓝色显示。幸存者区域为绿色。
总而言之，关于G1的年轻一代，可以说以下几点：

- 堆是单个内存空间，分为多个区域。
- 年轻代内存由一组非连续区域组成。
- 年轻一代的垃圾收集器或年轻的GC出现STW。将停止所有应用程序线程以进行操作。
- 年轻的GC使用多个线程并行完成。
- 将活动对象复制到新的幸存者或老年代的地区。  



G1 Mix GC  

**初始标记阶段（initial mark,STW)**

存活的对象的初始标记背负在年轻的垃圾收集器上。在日志中，此标记为 GC pause (young)(inital-mark) 。  

![image-20230219203250035](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-mixgc.png)

**并发标记阶段（Concurrent Marking）  **

如果找到空白区域（如“ X”所示），则在Remark阶段将其立即删除。另外，计算确定活跃度的信息。  

![image-20230219203400071](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%20mix.png)

**最终标记阶段（Remark，STW）  **

空区域将被删除并回收。现在可以计算所有区域的区域活跃度。  

![image-20230219203433957](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%E6%9C%80%E7%BB%88%E6%A0%87%E8%AE%B0%E9%98%B6%E6%AE%B5.png)

**筛选回收阶段/复制清理阶段（Cleanup，STW）  **

G1选择“活度”最低的区域，这些区域可以被最快地收集。然后与年轻的GC同时收集这些区域。这在日志中表示为**[GC pause (mixed)] **。因此，年轻代和老年代都是同时收集的。  

![image-20230219203517850](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-g1%20%E5%A4%8D%E5%88%B6%E6%B8%85%E7%90%86%E9%98%B6%E6%AE%B5.png)

**筛选回收阶段-(复制/清理)阶段之后  **

选定的区域已被收集并压缩为图中所示的深蓝色区域和深绿色区域。  

![image-20230219203627716](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E7%AD%9B%E9%80%89%E5%9B%9E%E6%94%B6%E9%98%B6%E6%AE%B5.png)

**总结:  **

- 并发标记阶段
  - 活动信息是在应用程序运行时同时计算的。
  - 该活动信息标识在疏散暂停期间最适合回收的区域。
  - 像CMS中没有清扫阶段。
- 最终标记阶段
  - 使用开始快照（SATB）算法，该算法比CMS使用的算法快得多。
  - 完全回收空区域。
- 筛选回收阶段
  - 同时回收年轻一代和老一代。
  - 老年代地区是根据其活跃度来选择的。  

G1常用参数：

| 参数/默认值                             | 含义                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| -XX:+UseG1GC                            | 使用 G1 垃圾收集器                                           |
| -XX:MaxGCPauseMillis=200                | 设置期望达到的最大GC停顿时间指标（JVM会尽力实现，但不保 证达到） |
| - X X:InitiatingHeapOccupancyPercent=45 | mixed gc中也有一个阈值参数 ，当老年代大小占整个堆大小百分 比达到该阈值时，会触发一次mixed gc. 默认值为 45. |
| -XX:NewRatio=n                          | 新生代与老生代(new/old generation)的大小比例(Ratio). 默认值为 2. |
| -XX:SurvivorRatio=n                     | eden/survivor 空间大小的比例(Ratio). 默认值为 8.             |
| -XX:MaxTenuringThreshold=n              | 提升年老代的最大临界值(tenuring threshold). 默认值为 15.     |
| -XX:ParallelGCThreads=n                 | 设置垃圾收集器在并行阶段使用的线程数,默认值随JVM运行的平 台不同而不同. |
| -XX:ConcGCThreads=n                     | 并发垃圾收集器使用的线程数量. 默认值随JVM运行的平台不同而 不同. |
| -XX:G1ReservePercent=n                  | 设置堆内存保留为假天花板的总量,以降低提升失败的可能性. 默认 值是 10. |



#### 4.9 垃圾收集器参数总结

| 参数                   | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| UseSerialGC            | 虚拟机运行在client模式下的默认值，打开此开关后，使用Serial+Serial Old的收集器组合进行内存回收 |
| UseParNewGC            | 打开后，使用ParNew + Serial Old组合进行内存回收              |
| UseConcMarkSweepGC     | 打开后，使用ParNew + CMS + Serial Old组合回收，Serial Old收集器将作为CMS收集器出现Concurrent Mode Failure失败后的后备收集器使用 |
| UseParallelGC          | 虚拟机在server模式下的默认值，打开后，使用Parallel Scavenge +Serial Old（PS MarkSweep)收集内存 |
| UseParallelOldGC       | 打开后，使用Parallel Scavenge + Parallel Old组合收集内存     |
| SurvivorRatio          | 新生代Eden与Survivor比例，默认8：1                           |
| PretenureSizeThreshold | 直接晋升到老年代的对象大小，设置后，大于这个参数的对象直接在老年代分配 |
| MaxTenuringThreshold   | 晋升到老年代的对象年龄，每个对象经过一次Minor GC后，年龄+1，大于这个值后进入老年代 |
| UseAdaptiveSizePolicy  | 动态调整Java堆中各个区域的大小以及进入老年代的年龄           |
| HandlePromotionFailure | 是否允许分配担保失败，即老年代的剩余空间不足以应付新生代的整个Eden和Survivor区的所有对象都存活的极端情况 |
| ParallelGCThreads      | 设置并行GC时进行内存回收的线程数                             |



####  4.10 内存分配与回收策略

java体系中所提倡的自动内存管理最终可以归纳为自动地解决两个问题： 给对象分配内存以及内存回收分配给对象的内存

##### 对象优先在Eden分配

大多数情况下，对象优先在Eden去分配，当内存不足时，会触发一次Minor GC



##### 大对象直接进入老年代

 经常出现大对象导致内存还有不少空间时就提前触发垃圾收集以获取足够的连续空间来安置大对象。



##### 长期存活的对象进入老年代

虚拟机给每个对象定义了一个对象年龄，如果对象在Eden出生并经历一次Minor GC仍然存在，并且能被Survivor区容纳，将被移动到Survivor空间中，并且对象年龄设置1，经历过一次MinorGC，年龄就+1，当到一定程度（默认**15**），就晋升到老年代。通过参数：

-XX:MaxTenuringThreshold设置



##### 动态对象年龄判断

为了更好的适应不同程序的内存情况，虚拟机不是永远要求对象的年龄必须达到MaxTenuringThreshold才能晋升到老年代，**如果Survivor空间中相同年龄所有对象大小的和大于Survivor空间的一半，年龄大于或等于该年龄的对象就可以直接进入老年代，无需等到MaxTenuringThreshold中要求的年龄**



##### 空间分配担保

在发生Minor GC之前，虚拟机会先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果这个条件成立，那么Minor GC可以确保是安全的，如果不成立，则虚拟机会查看HandlePromotionFailure设置是否允许担保失败，如果允许，会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代的对象的平均大小，如果大于，将尝试进行一次Minor GC，尽管这次GC存在风险；如果小于，或者HandlePromotionFailure不允许冒险，那么这个时候改为进行一次Full GC.





## 四、常用指令与可视化调优工具

### 1. 常用命令

#### 1.1 jps

jps 是（java process Status Tool）, Java版的ps命令，查看java进程及其相关的信息，如果你想找到一个java进程的pid，那可以用jps命令替代linux中的ps命令了，简单而方便。  

```sh
jps [options] [hostid]
```

options参数解释：

- l：显示进程id，显示主类全名或jar路径
- q：显示进程id
- m：显示进程id，显示JVM启动时传递给main()的参数
- v：显示进程id，显示JVM启动时显示指定的JVM参数

hostid: 主机或其他服务器ip

常用实例：

jps -l 输出jar包路径，类全名

jps -m 输出main参数

jps -v 输出JVM参数



#### 1.2 jinfo

jinfo是用来查看JVM参数和动态修改部分JVM参数的命令

```sh
jinfo [option] <pid>
```

options参数解释：

- no options 输出系统所有的属性和参数
- -flag 打印指定名称的参数
- -flag [+ | -] 打开或关闭参数
- -flag=设置参数
- -flags 打印所有参数
- sysprops打印系统配置

常用实例：

如pid=11666

```java
/**
jinfo [option] <pid>
options参数解释：
- no options 输出所有的系统属性和参数
- -flag <name> 打印指定名称的参数
- -flag [+|-]<name> 打开或关闭参数
- -flag <name>=<value> 设置参数
- -flags 打印所有参数
- -sysprops 打印系统配置
**/
public class Demo2_jinfo {
    public static void main(String[] args) {
    System.out.println("jinfo 指令");
    try {
    	Thread.sleep(2000000);
    } catch (InterruptedException e) {
    	e.printStackTrace();
    	}
    }
}
```

查看JVM参数和系统配置

jinfo 11666

jinfo -flags 11666

jinfo -sysprops 11666

查看打印GC日志参数

jinfo -flag PrintGC 11666

jinfo -flag PrintGCDetails 11666



打开GC日志参数

jinfo -flag +PrintGC 11666

jinfo -flag +PrintGCDetails 11666



关闭GC日志参数

jinfo -flag -PrintGC 11666

jinfo -flag -PrintGCDetails 11666

还可以使用下面的命令查看那些参数可以使用jinfo命令来管理：  



#### 1.3 jstat

jstat命令是使用频率比较高的命令，主要用来查看JVM运行时的状态信息，包括内存状态、垃圾回收等。  

jstat [option] VMID [interval] [count]

其中VMID是进程id，interval是间隔打印时间，count是打印次数（默认一直打印）

options参数解释：

| 选项           | 作用                                                         |
| -------------- | ------------------------------------------------------------ |
| -class         | 监视类装载、卸载数量、总空间以及类装载所耗费的时间           |
| -gc            | 监视Java堆状况、包括Eden区，两个Survivor区、老年代，永久代等容量、已用空间、GC时间合计等信息 |
| -gccapacity    | 监视内容与-gc基本相同，但输出主要关注Java堆各个区域使用的最大，最小空间 |
| -gcutil        | 监视内容与-gc基本相同，但输出主要关注与使用空间占总空间的百分比 |
| -gccause       | 与-gcutil功能一直，但是会额外输出上一次GC产生的原因          |
| -gcnew         | 新生代行为统计                                               |
| -gcnewcapacity | 新生代与其相应的内存空间的统计                               |
| -gcold         | 监视老年代GC状况                                             |
| -gcoldcapacity | 老年代和永久代行为统计                                       |

常用示例及打印字段解释：  

jstat -gcutil 11666 1000 3  

11666为pid，每隔1000毫秒打印一次，打印3次  

![image-20230220212217909](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jstat%E8%AF%A6%E7%BB%86.png)

字段解释:
	S0 survivor0使用百分比
	S1 survivor1使用百分比
	E Eden区使用百分比
	O 老年代使用百分比
	M 元数据区使用百分比
	CCS 压缩使用百分比
	YGC 年轻代垃圾回收次数
	YGCT 年轻代垃圾回收消耗时间
	FGC Full GC垃圾回收次数
	FGCT Full GC垃圾回收消耗时间
	GCT 垃圾回收消耗总时间  



jstat -gc 11666 1000 3  

-gc和-gcutil参数类似，只不过输出字段不是百分比，而是实际的值。
输出  

![image-20230220212327890](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jstat%E7%99%BE%E5%88%86%E6%AF%94.png)

字段解释：
	S0C survivor0大小
	S1C survivor1大小
	S0U survivor0已使用大小
	S1U survivor1已使用大小
	EC Eden区大小
	EU Eden区已使用大小
	OC 老年代大小
	OU 老年代已使用大小	
	MC 方法区大小
	MU 方法区已使用大小
	CCSC 压缩类空间大小
	CCSU 压缩类空间已使用大小
	YGC 年轻代垃圾回收次数
	YGCT 年轻代垃圾回收消耗时间
	FGC Full GC垃圾回收次数
	FGCT Full GC垃圾回收消耗时间
	GCT 垃圾回收消耗总时间  

#### 1.4 jstack

jstack是用来查看JVM线程快照的命令，线程快照是当前JVM线程正在执行的方法堆栈集合。使用jstack命令可以定位线程出现长时间卡顿的原因，例如死锁，死循环等。jstack还可以查看程序崩溃时生成的core文件中的stack信息。  

jstack [options]  vmid

option参数解释：

- -F 当使用jstack 无响应时，强制输出线程堆栈。
- -m 同时输出java堆栈和c/c++堆栈信息(混合模式)
- -l 除了输出堆栈信息外,还显示关于锁的附加信息  

CPU占用过高问题

1. 使用Process Explorer工具找到cpu占用过高的线程
2. 在thread卡中找到cpu占用高的线程id
3. 线程id转为16进制
4. 使用jstack -l 查看进程的线程快照
5. 线程快照中找到指定线程，并分析代码



jstack检查死锁问题  

```java
public class DeadLock {
    private static Object obj1 = new Object();
    private static Object obj2 = new Object();
    
    public static void main(String[] args) {
        new Thread(new Thread1()).start();
        new Thread(new Thread2()).start();
    } 
    private static class Thread1 implements Runnable{
        public void run() {
            synchronized (obj1){
            	System.out.println("Thread1 拿到了 obj1 的锁！");
                try {
                    // 停顿2秒的意义在于，让Thread2线程拿到obj2的锁
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } 
                synchronized (obj2){
                    System.out.println("Thread1 拿到了 obj2 的锁！");
                }
           }
       }
	} 
    private static class Thread2 implements Runnable{
        public void run() {
            synchronized (obj2){
            	System.out.println("Thread2 拿到了 obj2 的锁！");
           		try {
                    // 停顿2秒的意义在于，让Thread1线程拿到obj1的锁
                    Thread.sleep(2000);
                } catch (InterruptedException e) {
                	e.printStackTrace();
                } 
                synchronized (obj1){
                	System.out.println("Thread2 拿到了 obj1 的锁！");
                }
			}
		}
	}
}
```

执行指令：

jstack -l 11666

打印结果：

```sh
Found one Java-level deadlock:
=============================
"Thread-1":
waiting to lock monitor 0x00007efc880062c8 (object 0x00000000ec1dc5c8, a java.lang.Object),
which is held by "Thread-0"
"Thread-0":
waiting to lock monitor 0x00007efc88004e28 (object 0x00000000ec1dc5d8, a java.lang.Object),
which is held by "Thread-1"
Java stack information for the threads listed above:
===================================================
"Thread-1":
at DeadLock$Thread2.run(DeadLock.java:35)
- waiting to lock <0x00000000ec1dc5c8> (a java.lang.Object)
- locked <0x00000000ec1dc5d8> (a java.lang.Object)
at java.lang.Thread.run(Thread.java:748)
"Thread-0":
at DeadLock$Thread1.run(DeadLock.java:19)
- waiting to lock <0x00000000ec1dc5d8> (a java.lang.Object)
- locked <0x00000000ec1dc5c8> (a java.lang.Object)
at java.lang.Thread.run(Thread.java:748)
```

Found 1 deadlock



#### 1.5 jmap

jmap可以生成 java 程序的 dump 文件， 也可以查看堆内对象示例的统计信息、查看 ClassLoader 的信息以及finalizer 队列  

jmap [option] vmid

参数解释：

- -dump 生成java堆的转储快照，格式为：-dump:[live,]format=b,file=filename,其中live自参数说明是否只dump存活的对象
- -heap 显示java堆详细信息，如使用哪种收集器、参数配置、分代状况等
- -histo:[:live] 显示堆中对象统计信息，包括类、实例数量、合计容量
- -finalizerinfo 显示在F-Queue中等待Finalizer线程执行finalizer方法的对象
- -clstats 打印类加载器统计信息

常用实例：



jmap -dump:live,format=b,file=dump.bin 11666

输出：

Dumping heap to /dump.bin ...
Heap dump file created  

这个命令是要把java堆中的存活对象信息转储到dump.bin文件



jmap -finalizerinfo 11666  

输出：

```
Attaching to process ID 11666, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 24.71-b01
Number of objects pending for finalization: 0
```

输出结果的含义为当前没有在等待执行finalizer方法的对象 

 

jmap -heap 11666  

输出堆的详细信息  

```shell
Attaching to process ID 11666, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 25.25-b02
using thread-local object allocation.
Parallel GC with 4 thread(s)
Heap Configuration: //堆内存初始化配置
    MinHeapFreeRatio = 0 //对应jvm启动参数-XX:MinHeapFreeRatio设置JVM堆最小空闲比率(default 40)
    MaxHeapFreeRatio = 100 //对应jvm启动参数 -XX:MaxHeapFreeRatio设置JVM堆最大空闲比率(default 70)
    MaxHeapSize= 1073741824 (1024.0MB) //对应jvm启动参数-XX:MaxHeapSize=设置JVM堆的最大大小
    NewSize = 22020096 (21.0MB) //对应jvm启动参数-XX:NewSize=设置JVM堆的新生代的默认大小
    MaxNewSize = 357564416 (341.0MB) //对应jvm启动参数-XX:MaxNewSize=设置JVM堆的新生代的最大大小
    OldSize = 45088768 (43.0MB) //对应jvm启动参数-XX:OldSize=<value>:设置JVM堆的老年代的大小
    NewRatio = 2 //对应jvm启动参数-XX:NewRatio=:新生代和老生代的大小比率
    SurvivorRatio = 8 //对应jvm启动参数-XX:SurvivorRatio=设置新生代中Eden区与Survivor区的大小比值
    MetaspaceSize = 21807104 (20.796875MB) // 元数据区大小
    CompressedClassSpaceSize = 1073741824 (1024.0MB) //类压缩空间大小
    MaxMetaspaceSize = 17592186044415 MB //元数据区最大大小
    G1HeapRegionSize = 0 (0.0MB) //G1垃圾收集器每个Region大小

Heap Usage: //堆内存使用情况
    PS Young Generation
    Eden Space: //Eden区内存分布
    capacity = 17825792 (17.0MB) //Eden区总容量
    used = 12704088 (12.115562438964844MB) //Eden区已使用
    free = 5121704 (4.884437561035156MB) //Eden区剩余容量
    71.26801434685203% used //Eden区使用比率

From Space: //其中一个Survivor区的内存分布
    capacity = 2097152 (2.0MB)
    used = 1703936 (1.625MB)
    free = 393216 (0.375MB)
    81.25% used
    
To Space: //另一个Survivor区的内存分布
    capacity = 2097152 (2.0MB)
    used = 0 (0.0MB)
    free = 2097152 (2.0MB)
    0.0% used
PS Old Generation
    capacity = 52428800 (50.0MB) //老年代容量
    used = 28325712 (27.013504028320312MB) //老年代已使用
    free = 24103088 (22.986495971679688MB) //老年代空闲
    54.027008056640625% used //老年代使用比率
15884 interned Strings occupying 2075304 bytes.
```



jmap -histo:live 11666 | more  

输出存活对象统计信息  

![image-20230220214054601](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jmp.png)



#### 1.6 jhat

jhat是用来分析jmap生成dump文件的命令，jhat内置了应用服务器，可以通过网页查看dump文件分析结果，jhat一般是用在离线分析上。 

jhat [option] [dumpfile]

参数解释：

- -stack false: 关闭对象分配调用堆栈的跟踪
- -refs false: 关闭对象引用的跟踪
- -port: HTTp服务器端口，默认7000
- -debug: debug级别
- -version: 分析报告版本

常用实例：

jhat dump.bin



### 2. JVM常用工具

#### 2.1 Jconsole监控管理工具

不常用，但是jvm自带

#### 2.2 VisualVM可视化优化工具

VisualVM 是一个工具，它提供了一个可视界面，用于查看 Java 虚拟机 (Java Virtual Machine, JVM) 上运行的基于Java 技术的应用程序（Java 应用程序）的详细信息。VisualVM 对 Java Development Kit (JDK) 工具所检索的 JVM 软件相关数据进行组织，并通过一种使您可以快速查看有关多个 Java 应用程序的数据的方式提供该信息。您可以查看本地应用程序以及远程主机上运行的应用程序的相关数据。此外，还可以捕获有关 JVM 软件实例的数据，并将该数据保存到本地系统，以供后期查看或与其他用户共享。  



## 五、GC日志分析

GC日志是一个很重要的工具，它准确记录了每一次的GC的执行时间和执行结果，通过分析GC日志可以优化堆设置和GC设置，或者改进应用程序的对象分配模式。  

### 1. GC参数日志

不同的垃圾收集器，输出的日志格式各不相同，但也有一些相同的特征。熟悉各个常用垃圾收集器的GC日志，是进行JVM调优的必备一步。 解析GC日志，首先需要收集日志，常用的有以下JVM参数用来打印输出日志信息：  

#### 1.1 GC日志参数

| 参数                   | 说明                               |
| ---------------------- | ---------------------------------- |
| -XX:+PrintGC           | 打印简单GC日志。 类似：-verbose:gc |
| -XX:+PrintGCDetails    | 打印GC详细信息                     |
| -XX:+PrintGCTimeStamps | 输出GC的时间戳（以基准时间的形式） |
| -XX:+PrintGCDateStamps | 输出GC的时间戳（以日期的形式）     |
| -XX:+PrintHeapAtGC     | 在进行GC的前后打印出堆的信息       |
| -Xloggc:../logs/gc.log | 指定输出路径收集日志到日志文件     |

例如，使用如下参数启动：  

-Xms28m
-Xmx28m
//开启记录GC日志详细信息（包括GC类型、各个操作使用的时间）,并且在程序运行结束打印出JVM的内存占用情况
-XX:+PrintGCDetails
-XX:+PrintGCDateStamps
-XX:+UseGCLogFileRotation 开启滚动生成日志
-Xloggc:E:/logs/gc.log  



#### 1.2 常用垃圾收集器参数

| 参数                           | 描述                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| UseSerialGC                    | 虚拟机在运行在 Client 模式下的默认值，打开此开关后，使用 Serial+Serial Old 收集器组合进行内存回收 |
| UseParNewGC                    | 使用 ParNew + Serial Old 收集器组合进行内存回收              |
| UseConcMarkSweepGC             | 使用 ParNew + CMS + Serial Old 的收集器组合尽心内存回收，当 CMS 出现 Concurrent Mode Failure 失败后会使用 Serial Old 作为备用收集器 |
| UseParallelOldGC               | 使用 Parallel Scavenge + Parallel Old 的收集器组合           |
| UseParallelGC                  | 使用 Parallel Scavenge + Serial Old （PS MarkSweep）的收集器组合 |
| SurvivorRatio                  | 新生代中 Eden 和任何一个 Survivor 区域的容量比值，默认为 8   |
| PretenureSizeThreshold         | 直接晋升到老年代对象的大小，单位是Byte                       |
| UseAdaptiveSizePolicy          | 动态调整 Java 堆中各区域的大小以及进入老年代的年龄           |
| ParallelGCThreads              | 设置并行 GC 时进行内存回收的线程数                           |
| GCTimeRatio                    | GC 时间占总时间的比率，默认值为99，只在 Parallel Scavenge 收集器的 时候生效 |
| MaxGCPauseMillis               | 设置 GC 最大的停顿时间，只在 Parallel Scavenge 收集器的时候生效 |
| CMSInitiatingOccupancyFraction | 设置 CMS 收集器在老年代空间被使用多少后触发垃圾收集，默认是 68%，仅在 CMS 收集器上生效 |
| CMSFullGCsBeforeCompaction     | 设置 CMS 收集器在进行多少次垃圾回收之后启动一次内存碎片整理  |
| UseG1GC                        | 使用 G1 (Garbage First) 垃圾收集器                           |
| MaxGCPauseMillis               | 设置最大GC停顿时间(GC pause time)指标(target). 这是一个软性指标(sox goal), JVM 会尽量去达成这个目标. |
| G1HeapRegionSize               | 使用G1时Java堆会被分为大小统一的的区(region)。此参数可以指定每个 heap区的大小. 默认值将根据 heap size 算出最优解. 最小值为 1Mb, 最大值 为 32Mb. |

### 2. Gc日志分析

#### 2.1 日志的含义

GC 日志理解起来十分简单，因为日志本来就是要给开发人员看的，所以设计的很直观。
举个例子，我们来分别说明各个部分所代表的含义：

```sh
[GC (Allocation Failure) [PSYoungGen: 6146K->904K(9216K)] 6146K->5008K(19456K), 0.0038730
secs] [Times: user=0.08 sys=0.00, real=0.00 secs]
```

将上面 GC 日志抽象为各个部分，然后我们再分别说明各个部分的含义

```sh
[a(b)[c:d->e(f), g secs] h->i(j), k secs] [Times: user:l sys=m, real=n secs]  
```

a: GC 或者是 Full GC
b: 用来说明发生这次 GC 的原因
c: 表示发生GC的区域，这里表示是新生代发生了GC，上面那个例子是因为在新生代中内存不够给新对象分配了，然后触发了 GC
d: GC 之前该区域已使用的容量
e: GC 之后该区域已使用的容量
f: 该内存区域的总容量
g: 表示该区域这次 GC 使用的时间
h: 表示 GC 前整个堆的已使用容量
i: 表示 GC 后整个堆的已使用容量
j: 表示 Java 堆的总容量
k: 表示 Java堆 这次 GC 使用的时间
l: 代表用户态消耗的 CPU 时间
m: 代表内核态消耗的 CPU 时间
n: 整个 GC 事件从开始到结束的墙钟时间（Wall Clock Time）  



##### 2.2 使用ParNew+Serial Old的组合进行内存回收

设置JVM参数

```sh
-Xms20M -Xmx20M -Xmn10M -XX:+UseParNewGC -XX:+PrintGCDetails -XX:SurvivorRatio=8
```

测试代码：

```java
public class TestGCLog01 {
private static final int _1MB = 1024*1024;
/**
* VM参数：
* 1. -Xms20M -Xmx20M -Xmn10M -XX:+UseParNewGC
-XX:+PrintGCDetails -XX:SurvivorRatio=8
*/
public static void testAllocation() {
    byte[] allocation1, allocation2, allocation3, allocation4;
    allocation1 = new byte[2*_1MB];
    allocation2 = new byte[2*_1MB];
    allocation3 = new byte[2*_1MB];
    allocation4 = new byte[4*_1MB]; //出现一次 Minor GC
    }
}
```

打印结果：

```
[GC (Allocation Failure) [ParNew: 6146K->753K(9216K), 0.0065877 secs] 6146K->4849K(19456K),
0.0092108 secs] [Times: user=0.06 sys=0.00, real=0.01 secs]
Heap
	par new generation total 9216K, used 7220K [0x00000000fec00000, 0x00000000ff600000,
0x00000000ff600000)
eden space 8192K, 78% used [0x00000000fec00000, 0x00000000ff250ea0, 0x00000000ff400000)
from space 1024K, 73% used [0x00000000ff500000, 0x00000000ff5bc488, 0x00000000ff600000)
to space 1024K, 0% used [0x00000000ff400000, 0x00000000ff400000, 0x00000000ff500000)
tenured generation total 10240K, used 4096K [0x00000000ff600000, 0x0000000100000000,
0x0000000100000000)
	the space 10240K, 40% used [0x00000000ff600000, 0x00000000ffa00020, 0x00000000ffa00200,
0x0000000100000000)
	Metaspace used 3362K, capacity 4496K, committed 4864K, reserved 1056768K
class space used 369K, capacity 388K, committed 512K, reserved 1048576K
Java HotSpot(TM) 64-Bit Server VM warning: Using the ParNew young collector with the Serial old
collector is deprecated and will likely be removed in a future release
```

结果分析
通过上面的GC日志我们可以看出一开始出现了 MinorGC, 引起GC的原因是**内存分配失败** ，因为分配allocation的时
候，Eden区已经没有足够的区域来分配了，所以发生来本次 MinorGC ，经过 MinorGC 之后新生代的已使用容量从
6146K->753K，然而整个堆的内存总量却几乎没有减少，原因就是，由于发现新生代没有可以回收的对象，所以不
得不使用内存担保将allocation1～3 三个对象提前转移到老年代。此时再在 Eden 区域为 allocation 分配 4MB 的空
间，因此最后我们发现 Eden 区域占用了 4MB，老年代占用了 6MB  



##### 2.3 使用 Parallel Scavenge + Parallel Old 的组合进行内存回收

设置参数:  

```sh
-Xms20M -Xmx20M -Xmn10M -XX:+UseParallelGC -XX:+PrintGCDetails -XX:SurvivorRatio=8	
```

测试代码：

```java
public class TestGCLog02 {
    private static final int _1MB = 1024*1024;
    /**
    * VM参数：
    * 2. -Xms20M -Xmx20M -Xmn10M -XX:+UseParallelGC -XX:+UseParallelOldGC -XX:+PrintGCDetails
    -XX:SurvivorRatio=8
    */
    public static void testAllocation() {
        byte[] allocation1, allocation2, allocation3, allocation4;
        allocation1 = new byte[2*_1MB];
        allocation2 = new byte[2*_1MB];
        allocation3 = new byte[2*_1MB];
        allocation4 = new byte[4*_1MB]; //出现一次 Minor GC
    }
    public static void main(String[] args) {
   	 	testAllocation();
   	 }
}
```

执行结果  

```sh
[GC (Allocation Failure) [PSYoungGen: 6146K->872K(9216K)] 6146K->4976K(19456K), 0.0138583 secs]
[Times: user=0.06 sys=0.00, real=0.01 secs]
Heap
	PSYoungGen total 9216K, used 7339K [0x00000000ff600000, 0x0000000100000000,
0x0000000100000000)
eden space 8192K, 78% used [0x00000000ff600000,0x00000000ffc50e68,0x00000000ffe00000)
from space 1024K, 85% used [0x00000000ffe00000,0x00000000ffeda020,0x00000000fff00000)
to space 1024K, 0% used [0x00000000fff00000,0x00000000fff00000,0x0000000100000000)
ParOldGen total 10240K, used 4104K [0x00000000fec00000, 0x00000000ff600000,
0x00000000ff600000)
object space 10240K, 40% used [0x00000000fec00000,0x00000000ff002020,0x00000000ff600000)
	Metaspace used 3420K, capacity 4496K, committed 4864K, reserved 1056768K
class space used 371K, capacity 388K, committed 512K, reserved 1048576K
```

##### 2.4 大对象回收分析

大对象直接进入老年代 虚拟机提供一个参数 -XX:PretenureSizeThreshold 用来设置直接在老年代分配的对象的大小，如果对象大于这个值就会直接在老年代分配。这样做的目的是避免在 Eden 区及两个Survivor 区之间发生大量的内存复制。  

参数设置：

```shell
-verbose:gc -Xms20M -Xmx20M -Xmn10M -XX:+UseParNewGC -XX:+PrintGCDetails -XX:PretenureSizeThreshold=3145728
```

测试代码：

```java
public class TestGCLog03 {
    private static final int _1MB = 1024 * 1024;
    /**
    * VM参数：（参数序号对应实验序号）
    * -Xms20M -Xmx20M -Xmn10M -XX:+UseParNewGC -XX:+PrintGCDetails -
    XX:PretenureSizeThreshold=3145728
    */
    public static void testPreteureSizeThreshold() {
        byte[] allocation;
        allocation = new byte[4 * _1MB];
    }
    public static void main(String[] args) {
    	testPreteureSizeThreshold();
    }
}
```

执行结果：

```sh
Heap
	par new generation total 9216K, used 2214K [0x00000000fec00000, 0x00000000ff600000,
0x00000000ff600000)
eden space 8192K, 27% used [0x00000000fec00000, 0x00000000fee29be8, 0x00000000ff400000)
from space 1024K, 0% used [0x00000000ff400000, 0x00000000ff400000, 0x00000000ff500000)
to space 1024K, 0% used [0x00000000ff500000, 0x00000000ff500000, 0x00000000ff600000)
tenured generation total 10240K, used 4096K [0x00000000ff600000, 0x0000000100000000,
0x0000000100000000)
the space 10240K, 40% used [0x00000000ff600000, 0x00000000ffa00010, 0x00000000ffa00200,
0x0000000100000000)
	Metaspace used 3430K, capacity 4496K, committed 4864K, reserved 1056768K
class space used 373K, capacity 388K, committed 512K, reserved 1048576K
```

结果分析:
通过上面的堆的内存占用情况很容易看出我们分配的4MB大小的对象直接被放到了老年代  



### 3.日志分析工具

#### 3.1 日志工具简介

GC日志可视化分析工具GCeasy和GCviewer。通过GC日志可视化分析工具，我们可以很方便的看到JVM各个分代的内存使用情况、垃圾回收次数、垃圾回收的原因、垃圾回收占用的时间、吞吐量等，这些指标在我们进行JVM调优的时候是很有用的。

- GCeasy是一款在线的GC日志分析器，可以通过GC日志分析进行内存泄露检测、GC暂停原因分析、JVM配置建
  议优化等功能，而且是可以免费使用
  [在线分析工具]( https://gceasy.io/index.jsp)
- GCViewer是一款实用的GC日志分析软件，免费开源使用，你需要安装jdk或者java环境才可以使用。软件为GC
  日志分析人员提供了强大的功能支持，有利于大大提高分析效率(个人觉得不好使用)



#### 3.2 测试准备

编写代码生成gc.log日志准备分析  

```java

import java.util.ArrayList;

public class TestGCLog04 {
    private static final int _1MB = 1024 * 1024;

    /**
     * -Xms100M -Xmx100M -XX:SurvivorRatio=8 -XX:+PrintGCDetails -Xloggc:D://logs/gc.log
     */
    public static void main(String[] args) {
        ArrayList<byte[]> list = new ArrayList<byte[]>();
        for (int i = 0; i < 500; i++) {
            byte[] arr = new byte[1024 * 100];
            list.add(arr);
            try {
                Thread.sleep(20);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

gc.log日志文件日志如下：

```sh
Java HotSpot(TM) 64-Bit Server VM (25.172-b11) for windows-amd64 JRE (1.8.0_172-b11), built on Mar 28 2018 21:21:52 by "java_re" with MS VC++ 10.0 (VS2010)
Memory: 4k page, physical 25019944k(11007860k free), swap 50126084k(15808760k free)
CommandLine flags: -XX:InitialHeapSize=104857600 -XX:MaxHeapSize=104857600 -XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:SurvivorRatio=8 -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:-UseLargePagesIndividualAllocation -XX:+UseParallelGC 
6.815: [GC (Allocation Failure) [PSYoungGen: 27600K->3049K(30720K)] 27600K->22943K(99328K), 0.0052976 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
15.430: [GC (Allocation Failure) [PSYoungGen: 30678K->3045K(30720K)] 50572K->50651K(99328K), 0.0064441 secs] [Times: user=0.00 sys=0.16, real=0.01 secs] 
15.438: [Full GC (Ergonomics) [PSYoungGen: 3045K->0K(30720K)] [ParOldGen: 47605K->50240K(68608K)] 50651K->50240K(99328K), [Metaspace: 3991K->3991K(1056768K)], 0.0227090 secs] [Times: user=0.16 sys=0.00, real=0.02 secs] 
Heap
 PSYoungGen      total 30720K, used 1710K [0x00000000fdf00000, 0x0000000100000000, 0x0000000100000000)
  eden space 27648K, 6% used [0x00000000fdf00000,0x00000000fe0abb50,0x00000000ffa00000)
  from space 3072K, 0% used [0x00000000ffd00000,0x00000000ffd00000,0x0000000100000000)
  to   space 3072K, 0% used [0x00000000ffa00000,0x00000000ffa00000,0x00000000ffd00000)
 ParOldGen       total 68608K, used 50240K [0x00000000f9c00000, 0x00000000fdf00000, 0x00000000fdf00000)
  object space 68608K, 73% used [0x00000000f9c00000,0x00000000fcd10218,0x00000000fdf00000)
 Metaspace       used 4003K, capacity 4568K, committed 4864K, reserved 1056768K
  class space    used 435K, capacity 460K, committed 512K, reserved 1048576K
```





#### 3.3 GCeasy

这是一个在线分析日志的工具，主要功能是免费的，存在部分收费，地址：https://gceasy.io/把上篇生成的日志文件，上传分析，就会接到可视化界面  

![image-20230221204911917](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-gc%E5%88%86%E6%9E%90%E5%B7%A5%E5%85%B7gceasy.png)

Allocated：各部分分配大小
Peak：峰值内存使用量  

![image-20230221204951958](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-gceasy2.png)

吞吐量：99.536%，运行应用程序的时间/(GC时间的比值+运行应用程序的时间)
平均GC停顿时间
最大GC停顿时间
GC停顿持续时间范围：时间范围、GC数量、百分百  

![image-20230221205048513](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-gceasy3.png)

左边菜单有很多：
GC之前的堆、GC之后的堆、GC持续时间、GC停顿持续时间、回收的内存字节、Young区内存变化、Old区内存变化、Metaspace内存变化、分配对象大小、对象从Young到Old内存大小变化后序的内容有：GC统计信息、Minor GC/Full GC信息、内存泄漏、GC的原因等等，所以这个工具的功能真的很强大我们可以对比一下，Parallel、CMS、G1的GC效率。



## 六、JVM调优实战

### 1.tomcat与JVM调优  

tomcat服务器在JavaEE项目中使用率非常高，所以在生产环境对tomcat的优化也变得非常重要了。 对于tomcat的优化，主要是从2个方面入手，一是，tomcat自身的配置，另一个是 tomcat所运行的jvm虚拟机的调优。  



### 2. 安装tomcat部署目录

#### 2.1 下载并安装tomcat

https://tomcat.apache.org/download-80.cgi

![image-20230223210912942](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80%E9%A1%B5%E9%9D%A2.png)



#### 2.2 配置tomcat

1. 启动解压tomcat并配置

   tar -xzvf  apache-tomcat-8.5.86.tar.gz

   cd apache-tomcat-8.5.86/conf/

```sh
#修改配置文件,配置tomcat管理用户
vim tomcat-users.xml
#写入如下消息
<role rolename="manager"/>
<role rolename="manager-gui"/>
<role rolename="admin"/>
<role rolename="admin-gui"/>
<user username="tomcat" password="tomcat" roles="admin-gui,admin,manager-gui,manager"/>

:wq 保存退出
```

1. 配置可以访问Server Status

   ```sh
   #如果是tomcat7,配置了tomcat用户就可以登录了,但是tomcat8不行,需要修改一个配置文件,否则访问会报403
   vim webapps/manager/META-INF/context.xml
   
   <Context antiResourceLocking="false" privileged="true" >
       <CookieProcessor className="org.apache.tomcat.util.http.Rfc6265CookieProcessor" sameSiteCookies="strict" />
       <!-- 注释这一句就好了
       <Valve className="org.apache.catalina.valves.RemoteAddrValve" allow="127\.\d+\.\d+\.\d+|::1|0:0:0:0:0:0:0:1" />
       -->
       <Manager sessionAttributeValueClassNameFilter="java\.lang\.(?:Boolean|Integer|Long|Number|String)|org\.apache\.catalina\.filters\.CsrfPreventionFilter\$LruCache(?:\$1)?|java\.util\.(?:Linked)?HashMap"/>
   </Context>
   
   :wq 保存退出
   ```

   访问tomcat，然后输入用户名tomcat,密码tomcat即可

   



#### 2.3 部署一个web项目

1. 将某个项目部署到tomcat中
2. 启动tomcat



### 3. 使用jmeter压测

下载即可使用

[官网地址](https://jmeter.apache.org/download_jmeter.cgi)

![image-20230223215646528](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-jmeter%E4%B8%8B%E8%BD%BD%E5%9C%B0%E5%9D%80.png)



### 4. 调整tomcat参数进行优化

#### 4.1 优化吞吐量

##### 4.1.1 禁用AJP服务

什么是AJP呢？ AJP（Apache JServer Protocol）是定向包协议 。WEB服务器和Servlet容器通过TCP连接来交互；为了节省SOCKET创建的昂贵代价，WEB服务器会尝试维护一个永久TCP连接到servlet容器，并且在多个请求和响应周期过程会重用连接。  

Tomcat在server.xml中配置了两种连接器：

- 第一个连接器监听8080端口，负责建立HTTP连接。在通过浏览器访问Tomcat服务器的Web应用时，使用的就是这个连接器。  
- 第二个连接器监听8009端口，负责和其他的HTTP服务器建立连接。在把Tomcat与其他HTTP服务器集成时，就需要用到这个连接器。AJP连接器可以通过AJP协议和一个web容器进行交互  

Nginx+tomcat的架构，都使用不上AJP协议，所以把AJP禁用，修改conf下server.xml文件，将AJP服务禁用掉即可。本个版本其实都默认注释掉了的

```sh
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
```

重启tomcat即可。

![image-20230223220120654](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%AE%BF%E9%97%AE%E6%96%B9%E5%BC%8F.png)



##### 4.1.2 设置执行器(线程池)

频繁的创建线程会造成性能浪费，所以使用线程池来进行优化，在tomcat中每一个用户请求都是一个线程，所以可以使用线程池提高性能，修改server.xml文件

```sh
<!--将注释打开-->
<Executor name="tomcatThreadPool" namePrefix="catalina‐exec‐" maxThreads="500" minSpareThreads="50" prestartminSpareThreads="true" maxQueueSize="100"/>
<!--
参数说明：
maxThreads：最大并发数，默认设置 200，一般建议在 500 ~ 1000，根据硬件设施和业务来判断
minSpareThreads：Tomcat初始化时创建的线程数，默认设置25
prestartminSpareThreads： 在 Tomcat 初始化的时候就初始化 minSpareThreads 的参数值，如果不等于 true，minSpareThreads 的值就没啥效果了
maxQueueSize，最大的等待队列数，超过则拒绝请求
-->
<!-- A "Connector" represents an endpoint by which requests are received
and responses are returned. Documentation at :
Java HTTP Connector: /docs/config/http.html
Java AJP Connector: /docs/config/ajp.html
APR (HTTP/AJP) Connector: /docs/apr.html
Define a non-SSL/TLS HTTP/1.1 Connector on port 8080
-->
<Connector port="8080" executor="tomcatThreadPool" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
<!-- A "Connector" using the shared thread pool-->
```

![image-20230223220506041](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E4%BC%98%E5%8C%96maxThread%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98%E5%9B%BE%E7%89%87.png)

在页面中显示最大线程数为-1，这个是正常的，仅仅是显示的问题，实际使用的指定的值
通过设置线程池，调整线程池相关的参数进行测试tomcat的性能。
设置: 最大线程数为500，初始为50  



##### 4.1.3 设置最大等待队列

默认情况下，请求发送到tomcat，如果tomcat正忙，那么该请求会一直等待。这样虽然 可以保证每个请求都能请求到，但是请求时间就会变长。
有些时候，我们也不一定要求请求一定等待，可以设置最大等待队列大小，如果超过就不等待了。这样虽然有些请求是失败的，但是请求时间会虽短。  

```sh
<!‐‐最大等待数为100‐‐>
<Executor name="tomcatThreadPool" namePrefix="catalina‐exec‐" maxThreads="500"
minSpareThreads="100"
prestartminSpareThreads="true" maxQueueSize="100"/>
```

线程是否是设置的越多越好呢？

**结论：并不是设置线程数越多吞吐量越好。因此需要根据我们具体的场景进行响应的调试，选取一个较优的参数。  **

##### 4.1.4 设置nio2的运行模式

tomcat的运行模式有3种：

1. bio 默认的模式,性能非常低下,没有经过任何优化处理和支持.
2. nio nio(new I/O)，是Java SE 1.4及后续版本提供的一种新的I/O操作方式(即java.nio包及其子包)。Java nio是一个基于缓冲区、并能提供非阻塞I/O操作的Java API，因此nio 也被看成是non-blocking I/O的缩写。它拥有比传统I/O操作(bio)更好的并发运行性能。
3. apr 安装起来最困难,但是从操作系统级别来解决异步的IO问题,大幅度的提高性能. 推荐使用nio，**不过，在tomcat8中有最新的nio2，速度更快，建议使用nio2. 设置nio2**

  

```sh
<Connector executor="tomcatThreadPool" port="8080" protocol="org.apache.coyote.http11.Http11Nio2Protocol" connectionTimeout="20000" redirectPort="8443" />
```

![image-20230223220856529](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%AE%BE%E7%BD%AEnio2.png)

tomcat8之前的版本用的是BIO，推荐使用NIO，tomcat8中有最新的NIO2，速度更快，建议使用NIO2。  

值得注意的是：**理论上nio2的效果会优惠nio，多次执行,发现设定为nio2对于提升吞吐量效果不是很明显。可以根据自己的测试情况选择合适的io模型。  **



### 5. 调整JVM参数进行优化

测试通过jvm参数进行优化，为了测试一致性，依然将最大线程数设置为500， 启用nio2运行模式。  



#### 5.1 设置并行垃圾回收器

```sh
#年轻代、老年代均使用并行收集器，初始堆内存64M，最大堆内存512M
JAVA_OPTS="-XX:+UseParallelGC -XX:+UseParallelOldGC -Xms64m -Xmx512m -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+PrintHeapAtGC -Xloggc:../logs/gc.log"
```

vi catalina.sh：
将jvm参数添加进去--设置年轻代和老年代的垃圾收集器均为ParallelGC并行垃圾收集器。不设置jdk8默认也是使用ParallelGC：  

![image-20230223221141998](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%AE%BE%E7%BD%AE%E5%9B%9E%E6%94%B6%E5%99%A8.png)

#### 5.2 查看gc日志文件

将gc.log文件上传到gceasy.io中查看gc是否存在问题。以下使用案例

问题一: 年轻代和老年代空间大小分配不合理, 具体如下图  

![image-20230223221401633](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%B0%83%E4%BC%98%E6%A1%88%E4%BE%8B%E5%9B%BE1.png)

问题二: 0-100事件范围内执行MinorGC 太多 

![image-20230223221443272](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%B0%83%E4%BC%98%E6%A1%88%E5%88%97%E5%9B%BE2.png)

从图中可以看到0-100 100-200毫秒的gc 发生了9次和4次, 时间短,频率高,说明年轻代空间分配不合理,我们可以尝试给年轻代分配空间,减少Minor GC 频率, 降低Pause GC事件,提高吞吐量.  



问题三：下图中我们也能看到问题, Minor GC 发生了 14 次, Full GC 发生了2次。 Pause time 事件也较长。  

![image-20230223221526932](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%B0%83%E4%BC%98%E6%A1%88%E4%BE%8B%E5%9B%BE3.png)

#### 5.3 调整年轻代大小

> vi catalina.sh 

对比下之前的配置，将初始堆大小，年轻代大小均进行提升  

```sh
JAVA_OPTS="-XX:+UseParallelGC -XX:+UseParallelOldGC -Xms512m -Xmx512m -XX:NewRatio=2 -XX:SurvivorRatio=8 -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+PrintHeapAtGC -Xloggc:../logs/gc.log"
```

#### 5.4 查看GC日志  

![image-20230223221736048](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%B0%83%E4%BC%98%E5%90%8E%E5%9B%BE1.png)

![image-20230223221757665](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomcat%E8%B0%83%E4%BC%98%E5%90%8E%E5%9B%BE2.png)

**结论：吞吐量保持在97%以上，同时Minor GC次数明显减少，停顿次数减少  **



#### 5.5 设置G1垃圾收集器

理论上而言，设置为G1垃圾收集器，性能是会提升的。但是会受制于多方面的影响，也不一定绝对有提升。  

```sh
#设置使用G1垃圾收集器最大停顿时间100毫秒，初始堆内存512m，最大堆内存512m
JAVA_OPTS="-XX:+UseG1GC -XX:MaxGCPauseMillis=100 -Xms512m -Xmx512m -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:+PrintGCDateStamps -XX:+PrintHeapAtGC -Xloggc:../logs/gc.log"
```

![image-20230223221921033](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-tomat%E4%BD%BF%E7%94%A8G1%E6%94%B6%E9%9B%86%E5%99%A8%E7%BB%93%E8%AE%BA1.png)

由上图可以看到吞吐量上升, GC执行次数降低.  



## 七、Java内存模型与线程

### 1. 概述

衡量一个服务性能的高低好坏，每秒事务处理数（Transactions Per Second,TPS)是最重要的指标之一，它能代表着一个服务端水平平均能响应的请求数，而TPS值与程序的并发能力又有非常密切的关系。

由于计算机的存储设备与处理器的运算速度存在好几个量级的差距，所以现代计算机都不得不加入一层读写速度接近处理器运算速度的高速缓存（Cache）来作为内存和处理器的缓冲： 将运算需要使用到的数据复制到缓存中，让运算能快速进行，当运算结束后再从缓存中同步回内存中，这样处理器就无须等待缓慢的内存读写了。

引发的问题：**缓存一致性**

除了增加高速缓存之外，为了使得处理器内存的运算单元尽可能被充分利用，**处理器可能还会对输入代码进行乱序（Out -Of-Order Execution）执行优化**

与处理器的乱序执行优化类似，Java虚拟机的即时编译器中也有类似的指令重排序（Instruction reorder)优化



### 2. 主内存与工作内存

Java内存模型的主要目标：**定义程序中各个变量的访问规则，即在虚拟机中将变量存储到内存和从内存中读取变量这样的底层细节**

Java内存模型规定了**所有的变量都存储在主内存（Main Memory）**

![image-20230226115040336](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E4%B8%BB%E5%86%85%E5%AD%98%E5%92%8C%E5%B7%A5%E4%BD%9C%E5%86%85%E5%AD%98%E5%9B%BE.png)



#### 2.1. 内存之间的交互操作

关于主内存与工作内存之间的具体的交互协议： 即一个变量如何从主内存拷贝到工作内存，如何从工作内存同步到主内存的实现细节

| 动作         | 范围     | 作用                                                         |
| ------------ | -------- | ------------------------------------------------------------ |
| lock(锁定)   | 主内存   | 把一个变量标识为一条线程独占的状态                           |
| unlock(解锁) | 主内存   | 把一个处于锁定状态的变量释放出来，释放后的变量才能被其他线程锁定 |
| read(读取)   | 主内存   | 把一个变量的值从主内存传输到线程的工作内存中，以便于随后的load动作使用 |
| load(载入)   | 工作内存 | 把read操作从主内存中得到的值放到工作内存咋变量副本中         |
| use(使用)    | 工作内存 | 把工作内存中一个变量的值传递给执行引擎，每当虚拟机遇到一个需要使用的变量的值的字节码指令时会执行这个操作 |
| assign(赋值) | 工作内存 | 把一个从执行引擎接收到的值赋给工作内存的变量，每当虚拟机遇到一个变量赋值的字节码指令时执行这个操作 |
| store(存储)  | 工作内存 | 把工作内存中一个变量的值传递到主内存中，以便于随后的write操作使用 |
| write(写入)  | 主内存   | 把store操作从工作内存中得到的变量的值放入内存的变量中        |

**8种操作比如满足如下规则：**

- 不允许read和load、store和write操作之一单独出现
- 不允许一个线程丢弃它最近的assign操作
- 不允许一个线程无他原因把数据从线程的工作内存同步回主内存中
- 一个新的变量只能在主内存中**诞生**，不允许在工作内存中直接使用一个未被初始化的变量
- 一个变量只允许同一时刻只允许一条线程对其进行lock操作，但lock操作可以被同一个线程执行多次，并且需要多次unlock才能解锁
- 如果堆一个变量执行lock操作，那将清空工作内存中此变量的值
- 对一个变量执行unlock操作之前，必须先把变量同步会主内存中



#### 2.2. 对于volatile型变量的特殊规则

volatile是虚拟机中提供的最轻量级的同步机制，但是它并不容易完全被正确、完整的理解。

两个特性：

- 保证此变量对所有线程的**可见性**、这里**可见性**是指当一个线程修改了这个变量的值，新值对于其他线程来说是可以立即得知的
- 禁止指令重排序优化

**原因：**

变量添加了volatile修饰，赋值后会多一个**lock addl**的lock操作，这个操作相当于一个**内存屏障（Memory Barrier）**,指重排序时不能把后面的指令排序到内存屏障之前的位置。lock前缀，它的作用使得本CPU的Cache写入了内存，该写入动作也会引起别的CPU或别的内核无效化(Invalidate)其Cache，这个操作相当于对Cache中的变量做了一次"store"和“write”操作，所以通过这样一个空操作，可让前面volatile变量修改的值对其他CPU立即可见。

在某些情况下、volatile的同步机制的性能确实优于锁（使用synchronized关键字或者java.util.concurrent包里面的锁），但是由于虚拟机对锁实行的许多消除和优化，使得我们很难地量化的认为volatile会比synchornized快多少。

#### 2.3 对于long和double型变量的特殊规则

允许虚拟机将没有被volatile修饰的64位数据的读写操作分为两次32位的操作来进行，即允许虚拟机实现可以不保证64位的数据类型的load、store、read和write四个操作的原子性。这点就是所谓的long和double**非原子性协定**

商用的虚拟机中都已经选择把读写64位数据的操作都认为是原子操作来对待，所以我们实际开发中不需要特殊的对待long和double添加volatile关键





#### 2.4 原子性、可见性和有序性

原子性(Atomicity): 由Java内存模型来直接保证的原子性变量操作包括read、load、assign、use、stroe和write。

可见性(Visibility): 可见性是指一个线程修改了共性变量的值，其他线程能够立即得知这个修改。

除了volatile之外，Java还有synchronized和final能实现可见性，同步块的可见性由**对一个变量执行unlock操作之前，必须先把此变量同步回主内存中（执行store和write操作）**

final关键字的可见性是指： 被final修饰的字段在构造器中一旦初始化完成，并且构造器没有把**this**的引用传递出去，那在其他线程中就能看到final的值。

有序性Ordering）： 如何在本线程内观察，所有的操作都是有序的，如果在一个线程中观察另一个线程，所有的操作值无序的

**前半句是指线程内表现为串行的语义，后半句是指：指令重排序和工作内存与主内存的同步延迟现象**



this逃逸： 是表示为final修饰的变量，在构造器中通过this进行传递出去，那么其他线程就有可能通过引用访问到了这个**初始化一半**的对象



#### 2.5 先行发生原则（happens-befor）

先行发生原则： 判断数据是否存在竞争、线程是否安全的主要依据，依靠这个规则，我们可以通过几条规则一揽子地解决并发环境下两个操作之间是否可能存在冲突的所有问题。

先行发生原则如下：

- 程序次序规则： 在一个线程内，按照程序代码顺序，前面的代码优先于后面的代码。
- 管程锁定规则： 一个unlock规则先生发生于后面一个同一个锁的lock操作。
- volatile变量规则：对一个volatile域的写，happens-before于任意后续对这个volatile域的读。

- 线程启动规则：Thread对象的start()方法先行于此线程的每一个动作
- 线程终止规则：线程中的左右操作都先行于线程的终止检测，可以通过Thread.join()方法结束、Thread.isAlive()返回值等检测线程已经终止。
- 线程中断规则：对线程interrupted()方法的调用先行于被中断线程的代码检测到中断时间的发生。
- 对象终结规则：一个对象的初始化完成（构造函数执行结束）先行于发生它的finalize()方法的开始。

- 传递性：如果A happens-before B，且B happens-before C，那么A happens-before C。



### 3. Java与线程

#### 3.1 线程的实现

我们知道，线程是比进程更轻量级的调度执行单位，线程的引入，可以把一个进程的资源分配和调度分开，每个线程即可以共享线程资源(内存地址,IO文件等)，又可以独立调度（线程是CPU调度的基本单位）

实现线程主要有三种方式： 使用内核线程实现、使用用户线程实现和使用用户线程加轻量级进程混合实现



**java线程的实现**： 基于操作系统原生线程模型来实现，对于Sun JDK来说，使用一对一的线程模型实现的，一条Java线程就映射到一条轻量级进程中，因为windows和linux系统提供的线程模型就是一对一。





### 4. 线程状态

线程分别有五种状态： 

- 新建(New): 创建后未启动的线程
- 运行(Runable): Runable包括了操作系统状态中的runable和Ready，也就是可能处于运行，也可能是在等待
- 无期限等待(Waiting):  处于这种状态的线程不会被分配CPU执行时间，它们要等待被其他线程显式唤醒，以下方式会让线程陷入等待状态
  - 没有设置超时的Object.wait()
  - 没有设置超时的Tread.join()
  - LockSupport.park()
- 限期等待（Timed Waiting): 处于这种状态的线程也不会被分配CPU时间，不过可以由系统自动唤醒，以下方式可以陷入限期等待：
  - Thread.sleep()
  - 有超时时间的Object.wait()
  - 有超时时间的Thread.join()
  - LockSupport.parkNanos()
  - LockSupport.parkUnitl()
- 阻塞（Blocked): 线程被阻塞了，“阻塞状态”与“等待状态”的区别是： 阻塞状态”在等待着获取到一个排它锁，这个事件将在另外一个线程放弃这个锁的时候发生；而“等待状态”则是等待一段时间，或者发生唤醒动作的发生。线程进入同步区域的时候，线程进入这种状态
- 结束(Terminated): 已终止线程的线程状态，线程已经结束运行



![image-20211012114330991-16346333160091](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img202110201040490.png)





## 八、线程安全与锁优化

线程安全： 当多个线程访问一个对象时，如果不考虑这些线程在运行时环境下的调度和交替执行，也不需要额外的同步，或者在调用方进行任何其他的协调操作，调用这个对象的行为都可以获得正确的结果，那么这个对象是线程安全的。

### 1. Java语言中的线程安全

将Java语言中的各种操作共享数据分为五类： 不可变、绝对线程安全、相对线程安全、线程兼容和线程对立

- 不可变

  被Java内存模型修正后的Java语言，不可变的对象一定是线程安全的，无论对象的方式实现还是方法的调用者，都不需要采用任何的线程安全保障措施，如：final修饰的类，String类的substring,replace和concat方法都是返回新的对象，并不会更改原来的string对象

- 绝对线程安全

- 相对线程安全

  Java中大部分线程安全的类都属于这种类型，例如：Vector，Hashtable，Collections的synchronizedCollection()方法包装的集合等

- 线程兼容

  指对象本身不是线程安全的，但是可以通过调用端正确的使用同步手段来保证对象可以在并发环境下可以安全的使用

- 线程对立

  是指无论调用端是否采用了同步措施，都无法在多线程环境下并发的使用代码，如：Thread类的suspend、resume方法

### 2.线程安全的方法实现

#### 1. 互斥同步

同步是指在多个线程并发访问共享数据时，保证共享数据在同一个时刻只能被一个线程使用。**互斥是因，同步是果；互斥是方法、同步是目的**

Java中最基本的互斥同步手段就是synachronized关键字，synachronized关键字经过编译之后，会在同步块的前后分别形成moniorenter和monitorexit来星条字节码指令，这两个字节码都需要一个reference类型的参数来殖民要锁定和解锁的对象。

执行monitorenter时，首先尝试获取对象的锁，如果这个对象没有锁定，或者大年线程已经持有了对象的锁，把锁的计数器+1，相应的执行monitorexit时进行-1，当计数器为0时，锁就被释放。

synachornized同步块对同一条线程来说是**可重入的，不会出现自己把自己锁死的问题**

因为Java的想成是映射到操作系统的原生线程之上，如果要阻塞或者唤醒一个线程，都需要操作系统来进行帮忙，那么就需要从用户态转到内核态，因此转换状态需要耗费处理器时间可能比用户代码执行额时间还要长，所以非必要情况下尽可能的少用synachornized关键字。

ReentrantLock重入锁来实现同步，对应的也是lock，unlock等，主要是添加了高级功能：等待可中断、可实现公平锁、锁可以绑定多个条件



#### 2. 非阻塞同步

互斥同步最主要的问题就是进行线程阻塞和唤醒锁带来的性能问题，因此这种同步也称为**阻塞同步**

基于冲突检测的乐观并发策略，需要借助硬件，所以就有CAS(Compare-And-Swap)，这种方式可能会存在ABA问题，为了解决ABA问题，J.U.C包提供了一种带标记的原子引用类**AtomicStampedReference**,它可以通过控制变量的版本来保证CAS的正确性。



#### 3. 无同步方案

如果一个方法本来就不涉及共享数据，那么自然就不存在需要同步资源，因此有一些代码天生就是线程安全的。

- 可重入代码（纯代码）

  可以在代码执行的任何地方进行打断，继而跳去执行另外一段代码，而在控制权返回后，原来的程序不会出现任何错误。

- 线程本地存储

  如果一段代码中所需要的数据必须与其他代码共享，那就看看这些共享数据的代码是否能保证在同一个线程中执行？如果能保证，我们就可以把共享数据在可见范围控制对在同一个线程之内，这样就无须使用同步也能敢保证线程之间不会出现数据争用的问题。

  ThreadLocal类实现线程本地存储的功能。每一个线程的Thread对象都有一个ThreadLocalMap对象，这个对象存储了一组以ThreadLocal,threadLocalHashCode为键，以本地线程变量为值的K-V值对，ThreadLocal对象就是当前线程的ThreadLocalMap的访问入口，每一个ThreadLocal对象都包含了一个独一无二的threadLocalHashCode值，使用这个值就可以在线程k-v值对中找回对应的本地线程变量。



### 3. 锁优化

适应性自旋、锁消除、锁粗化、轻量级锁、偏向锁等

#### 1. 自旋锁与自适应自旋

自旋： 线程在未抢占到资源的时候，进行等待，我们只需让线程执行一个忙循环（自旋），这项技术就是所谓的自旋锁

自旋的次数默认是10次，用户可以通过--XX:PreBlockSpin来进行更改

自适应自旋： 自适应意味着自旋的时间不在固定，而是由前一次在同一个锁上的自旋时间以及锁的持有着的状态来决定。



#### 2. 锁消除

锁消除是指虚拟机即时编译器在运行时，对代码上要求同步，但是被检测到不可能存在共享数据竞争的锁进行消除，锁消除的主要判断依据是来源于**逃逸分析的数据支持**，如字符串进行拼接

```java
public String concatString(String st1,String str2,String str3){
	return st1 + str2 + str3;
}
```

这个代码经过编译之后是会变成通过StringBuffer对象来进行append操作的。

```java
public String concatString(String str1,String str2,String str3){
	StringBuffer sb = new StringBuffer();
	sb.append(str1);
	sb.append(str2);
	sb.append(str2);
	return sb.toString();
}
```

其实这段代码就是存在锁同步的，StringBuffer就是添加了synachornized关键字，但是这里的sb对象是永远不会逃逸出去，那么其他线程就无法访问到，那就不存在需要添加锁的情况，所以虚拟机就会进行一个**锁消除**



#### 3. 锁粗化

锁粗化就是有一系列的连续操作都是对一个对象反复加锁和解锁，甚至加锁操作都是在循环体中，那么即使没有出现线程竞争，频繁的进行互斥同步操作也会导致不必要的性能损耗。所以直接就扩大加锁的范围即可。



#### 4. 轻量级锁

轻量级锁是1.6之后加入的新型锁机制，轻量级所并不是代替中量级锁的，它的本意是在没有多线程竞争的前提下，减少传统的重量级锁使用操作系统互斥量产生的性能损耗。

HotSpot虚拟机的对象头分成两个部分： 

第一部分： 用于存储对象自身的运行时数据，如Hash码、GC分代年龄等，这部分数据长度在32位和64位虚拟机中分别为32bit和64bit，官方称为**Mark Word**

，它是实现轻量级锁和偏向锁的关键。

第二部分： 用于存储指向方法区的对象类型数据的指针，如果是数组对象的话，还会有一个额外的部分用于存储数组长度



| 存储内容                             | 标志位 | 状态               |
| ------------------------------------ | ------ | ------------------ |
| 对象HashCode、对象分代年龄           | 01     | 未锁定             |
| 指向锁记录的指针                     | 00     | 轻量级锁定         |
| 指向重量级锁的指针                   | 10     | 锁膨胀(重量级锁定) |
| 空、不需要记录信息                   | 11     | GC标记             |
| 偏向线程ID、偏向时间戳、对象分代年龄 | 01     | 可偏向             |

简单地介绍了对象的内存布局后，我们把话题返回到轻量级锁的执行过程上。在代码进入同步块的时候，如果此同步对象没有被锁定（锁标志位为“01”状态），虚拟机首先将在当前线程的栈帧中建立一个名为锁记录（LockRecord）的空间，用于存储锁对象目前的MarkWord的拷贝（官方把这份拷贝加了一个Displaced前缀，即DisplacedMarkWord），这时候线程堆栈与对象头的状态。

![image-20230226211130805](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-markword%E6%8B%B7%E8%B4%9D.png)







然后，虚拟机将使用CAS操作尝试将对象的MarkWord更新为指向LockRecord的指针。如果这个更新动作成功了，那么这个线程就拥有了该对象的锁，并且对象MarkWord的锁标志位（MarkWord的最后2bit）将转变为“00”，即表示此对象处于轻量级锁定状态，这时候线程堆栈与对象头的状态。

![image-20230226211211255](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E8%8E%B7%E5%8F%96%E5%88%B0%E8%BD%BB%E9%87%8F%E7%BA%A7%E9%94%81.png)

如果这个更新操作失败了，虚拟机首先会检查对象的MarkWord是否指向当前线程的栈帧，如果只说明当前线程已经拥有了这个对象的锁，那就可以直接进入同步块继续执行，否则说明这个锁对象已经被其他线程抢占了。如果有两条以上的线程争用同一个锁，那轻量级锁就不再有效，要膨胀为重量级锁，锁标志的状态值变为“10”，MarkWord中存储的就是指向重量级锁（互斥量）的指针，后面等待锁的线程也要进入阻塞状态。

上面描述的是轻量级锁的加锁过程，它的解锁过程也是通过CAS操作来进行的，如果对象的MarkWord仍然指向着线程的锁记录，那就用CAS操作把对象当前的MarkWord和线程中复制的DisplacedMarkWord替换回来，如果替换成功，整个同步过程就完成了。如果替换失败，说明有其他线程尝试过获取该锁，那就要在释放锁的同时，唤醒被挂起的线程。



#### 5. 偏向锁

偏向锁也是JDK1.6中引入的一项锁优化，**它的目的是消除数据在无竞争情况下的同步原语**，进一步提高程序的运行性能。如果说轻量级锁是在无竞争的情况下使用CAS操作去消除同步使用的互斥量，那偏向锁就是在无竞争的情况下把整个同步都消除掉，连CAS操作都不做了。

假设当前虚拟机启用了偏向锁（启用参数-XX：+UseBiasedLocking，这是JDK1.6的默认值），那么，当锁对象第一次被线程获取的时候，虚拟机将会把对象头中的标志位设为“01”，即偏向模式。同时使用CAS操作把获取到这个锁的线程的ID记录在对象的MarkWord之中，如果CAS操作成功，持有偏向锁的线程以后每次进入这个锁相关的同步块时，虚拟机都可以不再进行任何同步操作（例如Locking、Unlocking及对MarkWord的Update等）。

当有另外一个线程去尝试获取这个锁时，偏向模式就宣告结束。根据锁对象目前是否处于被锁定的状态，撤销偏向（RevokeBias）后恢复到未锁定（标志位“01”）或轻量级锁定（标志位为“00”）的状态，后续的同步操作就如上面介绍的轻量级锁那样执行。偏向锁、轻量级锁的状态转化及对象MarkWord如下图所示。

![image-20230226210623510](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E5%81%8F%E5%90%91%E9%94%81%E7%A4%BA%E6%84%8F%E5%9B%BE.png)



锁升级的过程：

大致为无锁-->偏向锁---->轻量级锁---->重量级锁

![image-20230226212022106](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgjvm-%E9%94%81%E5%8D%87%E7%BA%A7%E8%BF%87%E7%A8%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png)
