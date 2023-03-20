# Spring学习笔记



## 一、核心思想

注意： IOC和AOP不是spring提出的，在spring之前就已经存在，只不过更偏向于理论化， spring在技
术层次把这两个思想做了⾮常好的实现（Java）  



### 1. IOC容器

#### 1.1 什么是IOC？

IoC Inversion of Control (控制反转/反转控制)，注意它是⼀个技术思想，不是⼀个技术实现
描述的事情： Java开发领域对象的创建，管理的问题
传统开发⽅式：⽐如类A依赖于类B，往往会在类A中new⼀个B的对象  

**IoC思想下开发⽅式：我们不⽤⾃⼰去new对象了，⽽是由IoC容器（Spring框架）去帮助我们实例化对象并且管理它，我们需要使⽤哪个对象，去问IoC容器要即可**
我们丧失了⼀个权利（创建、管理对象的权利） ,得到了⼀个福利（不⽤考虑对象的创建、管理等⼀系列
事情）
为什么叫做控制反转？
控制：指的是对象创建（实例化、管理）的权利
反转：控制权交给外部环境了（spring框架、 IoC容器）  

![image-20230319204124101](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/%E6%9C%89%E6%97%A0ioc%E5%88%86%E6%9E%90.png)

#### 1. 2 IOC解决了什么问题？

**IoC解决对象之间的耦合问题**



#### 1.3 IoC和DI的区别

DI： Dependancy Injection（依赖注⼊）
怎么理解：
IOC和DI描述的是同⼀件事情，只不过⻆度不⼀样罢了 

![image-20230305210010459](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspring-ioc-di.png)

### 2. AOP

#### 2.1 什么是AOP？

AOP: Aspect oriented Programming ⾯向切⾯编程/⾯向⽅⾯编程
AOP是OOP的延续，从OOP说起
OOP三⼤特征：封装、继承和多态
oop是⼀种垂直继承体系  

![image-20230319204810386](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-oop%E6%80%9D%E6%83%B3.png)

OOP编程思想可以解决⼤多数的代码重复问题，但是有⼀些情况是处理不了的，⽐如下⾯的在顶级⽗类
Animal中的多个⽅法中相同位置出现了重复代码， OOP就解决不了  

![image-20230319204915582](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-animal%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

横切逻辑代码  

![image-20230319204943770](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E6%A8%AA%E5%88%87%E9%80%BB%E8%BE%91%E4%BB%A3%E7%A0%81.png)

横切逻辑代码存在什么问题：

- 横切代码重复问题

- 横切逻辑代码和业务代码混杂在⼀起，代码臃肿，维护不⽅便

AOP出场， AOP独辟蹊径提出横向抽取机制，将横切逻辑代码和业务逻辑代码分析  

![image-20230319205010122](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-sop%E5%87%BA%E5%8E%82.png)

代码拆分容易，那么如何在不改变原有业务逻辑的情况下，悄⽆声息的把横切逻辑代码应⽤到原有的业
务逻辑中，达到和原来⼀样的效果，这个是⽐较难的  

#### 2.2 AOP在解决什么问题  

在不改变原有业务逻辑情况下，增强横切逻辑代码，根本上解耦合，避免横切逻辑代码重复  

#### 2.3 为什么叫做⾯向切⾯编程  

「切」：指的是横切逻辑，原有业务逻辑代码我们不能动，只能操作横切逻辑代码，所以⾯向横切逻辑
「⾯」：横切逻辑代码往往要影响的是很多个⽅法，每⼀个⽅法都如同⼀个点，多个点构成⾯，有⼀个
⾯的概念在⾥⾯（指的就是要被操作的代码片段，方法等位置）



## 二、手写实现IOC和AOP

### 2.1 案例

案例示意图如下所示：

![image-20230319205055983](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-aop%E6%A1%88%E4%BE%8B%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

1）问题⼀：在上述案例实现中， service 层实现类在使⽤ dao 层对象时，直接在TransferServiceImpl 中通过 AccountDao accountDao = new JdbcAccountDaoImpl() 获得了 dao层对象，然⽽⼀个 new 关键字却将 TransferServiceImpl 和 dao 层具体的⼀个实现类JdbcAccountDaoImpl 耦合在了⼀起，如果说技术架构发⽣⼀些变动， dao 层的实现要使⽤其它技术，⽐如 Mybatis，思考切换起来的成本？每⼀个 new 的地⽅都需要修改源代码，重新编译，⾯向接⼝开发的意义将⼤打折扣？
（2）问题⼆： service 层代码没有竟然还没有进⾏事务控制 ？！如果转账过程中出现异常，将可能导致数据库数据错乱，后果可能会很严重，尤其在⾦融业务。  



### 2.2 问题解决思路

- 针对问题⼀思考：
  - 实例化对象的⽅式除了 new 之外，还有什么技术？反射 (需要把类的全限定类名配置在xml中)
- 考虑使⽤设计模式中的⼯⼚模式解耦合，另外项⽬中往往有很多对象需要实例化，那就在⼯⼚中使⽤反 射技术实例化对象，⼯⼚模式很合适  

问题一：

new关键字在实例化对象，除了new之外还可以使用**反射技术**，Class.forName("全限定名");可以将全限定名配置到xml文件中

使用工厂类来通过反射技术产生对象，工厂模式是解耦的非常好的一种方式

![微信图片_20230319205142](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-aop%E5%8F%8D%E5%B0%84%E7%A4%BA%E4%BE%8B.png)

- 更进⼀步，代码中能否只声明所需实例的接⼝类型，不出现 new 也不出现⼯⼚类的字眼，如下代码所示？ 

  答案：能！

  声明⼀个变量并提供 set ⽅法，在反射的时候将所需要的对象注⼊进去即可

```java
public class TransferServiceImpl implements TransferService {
  private AccountDao accountDao;
  
  public void SetAccountDao(AccountDao accountDao ){
  		this.accountDao = accountDao;
  }
}
```



问题二：

service 层没有添加事务控制，怎么办？没有事务就添加上事务控制，⼿动控制 JDBC 的Connection 事务，但要注意将Connection和当前线程绑定（即保证⼀个线程只有⼀个Connection，这样操作才针对的是同⼀个 Connection，进⽽控制的是同⼀个事务ThreadLocal存储连接）  

![image-20230319205426875](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-aop%E9%97%AE%E9%A2%98%E4%BA%8C%E6%80%9D%E8%80%83.png)



## 三、Spring IOC应用

### 3.1. Spring IOC基础

![image-20230319205516331](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-ioc%E5%9F%BA%E7%A1%80.png)

#### 1.1 BeanFactory和ApplicationContext的区别

BeanFactory是Spring框架中IOC容器的顶层接口，只用来定义一些基础功能，一些基础规范，而ApplicationContext是它的一个子接口，所以ApplicationContext具有BeanFactory的所有功能。

我们通常称BeanFactory为SpringIOC的基础容器，ApplicationContext为容器高级接口，比BeanFactory具有更多的功能，比如国际化支持和资源访问等等

![image-20230319205543230](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-beanfactory%E7%B1%BB%E5%9B%BE.png)

启动IOC的方式

- Java环境下启动IOC容器

  - ClassPathXmlApplicationContext: 从类的根路劲下加载配置文件
  - FileSystemXmlApplicationContext: 从文件系统路径上加载配置文件
  - AnnotationConfigApplicationContext: 纯注解模式下启动Spring容器

- web环境下启动Ioc容器

  - 从xml启动容器

    略

  

#### 1.2 Bean的作用域

|     类型      | 说明                                                         |
| :-----------: | ------------------------------------------------------------ |
|   singleton   | 在 Spring 容器中仅存在一个 Bean 实例， Bean 以单例的形式存在。 |
|   prototype   | 每次从容器中调用 Bean 时，都会返回一个新的实例，即相当于执行 new   XxxBean() 的实例化操作。 |
|    request    | 每次 http 请求都会创建一个新的 Bean ， 仅用于 WebApplicationContext 环境。 |
|    session    | 同一个 http Session 共享一个 Bean ，不同的 http Session 使用不同的 Bean，仅用于 WebApplicationContext 环境。 |
| globalSession | 同一个全局 Session 共享一个 bean, 用于 Porlet, 仅用于 WebApplication 环境。 |

默认 使用的是singleton单例模式的作用域

#### 1.3 不同作用域的生命周期

单例模式： singleton

对象出生： 当创建容器时，对象就被创建了

对象活着： 只要容器存在，对象就一直活着

对象死亡： 容器销毁时，对象就死亡

**总结： 单例模式的bean生命周期和容器相同**



多例模式：prototype

对象出生： 当使用对象时，创建新的对象

对象活着： 只要对象在使用中，对象就一直活着

对象私网： 当对象长时间不使用时，被java的垃圾回收器回收了

**总结： 多模式的bean对象，spring框架支付者创建，不负责销毁**



### 3.2 Spring IOC高级特性

#### 2.1 lazy-init延迟加载

Bean的延迟加载（延迟创建)

ApplicationContext容器默认的行为是在启动时将所有的单例singleton bean提前进行实例化，提前实例化意味着初始化过程的一部分，applicationContext实例会创建并配置所有的singleton bean;

主要配置：

```xml
<bean id="testBean" calss="cn.lnlr.LazyBean" lazy-init="true" />
<!-- 全部开启 -->
<beans default-lazy-init="true">
<!-- no beans will be eagerly pre-instantiated... -->
</beans>
```

应用场景：

- 开启延迟加载能提高容器的启动速度和运转性能
- 对于不常用的bean设置延迟加载，也是为了提高性能



#### 2.2 FactoryBean和BeanFactory

BeanFactory接⼝是容器的顶级接⼝，定义了容器的⼀些基础⾏为，负责⽣产和管理Bean的⼀个⼯⼚，具体使⽤它下⾯的⼦接⼝类型，⽐如ApplicationContext；此处我们重点分析FactoryBean

Spring中Bean有两种，⼀种是普通Bean，⼀种是⼯⼚Bean（FactoryBean）， FactoryBean可以⽣成某⼀个类型的Bean实例（返回给我们），也就是说我们可以借助于它⾃定义Bean的创建过程。Bean创建的三种⽅式中的静态⽅法和实例化⽅法和FactoryBean作⽤类似， FactoryBean使⽤较多，尤其在Spring框架⼀些组件中会使⽤，还有其他框架和Spring框架整合时使⽤  

```java
// 可以让我们⾃定义Bean的创建过程（完成复杂Bean的定义）
public interface FactoryBean<T> {
    @Nullable
    // 返回FactoryBean创建的Bean实例，如果isSingleton返回true，则该实例会放到Spring容器
    的单例对象缓存池中Map
    T getObject() throws Exception;
    
    @Nullable
    // 返回FactoryBean创建的Bean类型
    Class<?> getObjectType();
    // 返回作⽤域是否单例
    default boolean isSingleton() {
   		 return true;
    }
}
```

结论：

BeanFactory是顶级接口

FactoryBean是创建Bean工厂

#### 2.3 后置处理器

Spring 提供两种后处理bean的扩展接口，分别为： BeanPostProcessor和BeanFactoryPostProcessor,两者在使用上是存在区别的

BeanFactoryPostProcessor: 主要是在BeanFactory初始化后使用，进行一些后置处理，针对的是BeanFactory----->生成Bean对象的这个过程

BeanPostProcessor: 是Bean的实例化（并不是整个Bean的生命周期之后）进行后置处理

**注意： 对象不一定是springbean,而springbean一定是一个对象**

SpringBean的生命周期

##### 2.3.1 BeanPostProcessor

BeanPostProcessor是针对Bean级别的后置处理，可以针对到具体的某一个Bean

```java
public interface BeanPostProcessor {
	@Nullable
	default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}

	
	@Nullable
	default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		return bean;
	}
}

```

该接⼝提供了两个⽅法，分别在Bean的初始化⽅法前和初始化⽅法后执⾏，具体这个初始化⽅法指的是什么⽅法，类似我们在定义bean时，定义了init-method所指定的⽅法。定义⼀个类实现了BeanPostProcessor，**默认是会对整个Spring容器中所有的bean进⾏处理。如果要对具体的某个bean处理，可以通过⽅法参数判断，两个类型参数分别为Object和String，第⼀个参数是每个bean的实例，第⼆个参数是每个bean的name或者id属性的值。所以我们可以通过第⼆个参数，来判断我们将要处理的具体的bean。**
注意：处理是发⽣在Spring容器的实例化和依赖注⼊之后  



##### 2.3.2 BeanFactoryPostProcessor

BeanFactory级别的处理器，是针对整个bean的工厂进行的，典型应用：PropertyPlaceholderConfigure

```java
@FunctionalInterface
public interface BeanFactoryPostProcessor {

	void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException;

}
```

此接⼝只提供了⼀个⽅法，⽅法参数为ConfigurableListableBeanFactory，该参数类型定义了⼀些⽅法  

![image-20230319205655514](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-configurableListable%E7%B1%BB%E5%9B%BE.png)

其中有个⽅法名为getBeanDefinition的⽅法，我们可以根据此⽅法，找到我们定义bean 的
BeanDefinition对象。然后我们可以对定义的属性进⾏修改，以下是BeanDefinition中的⽅法  

![image-20230318141721773](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimage-20230318141721773.png)

⽅法名字类似我们bean标签的属性， setBeanClassName对应bean标签中的class属性，所以当我们拿
到BeanDefinition对象时，我们可以⼿动修改bean标签中所定义的属性值。
**BeanDefinition对象： 我们在 XML 中定义的 bean标签， Spring 解析 bean 标签成为⼀个 JavaBean**
这个JavaBean 就是 BeanDefinition
**注意：调⽤ BeanFactoryPostProcessor ⽅法时，这时候bean还没有实例化，此时 bean 刚被解析成BeanDefinition对象  **

其实在整个Spring的容器里面，所有的bean对象都是被定义成BeanDefinition这个类来进行使用的。



## 四、Spring IOC源码深度剖析

原则：

- 定焦原则： 抓主线
- 宏观原则：站上帝视角，关注源码结构和业务流程（淡化具体某行代码的编写细节）

读源码的方法和技巧

- 断点（调用栈）
- 反调（Find Usages)
- 经验(Spring 框架中doXXX,做具体的处理的地方)





### 1. Spring IOC容器初始化主体流程

#### 1.1 Spring IOC的容器体系

IoC容器是Spring的核⼼模块，是抽象了对象管理、依赖关系管理的框架解决⽅案。 Spring 提供了很多的容器，其中 BeanFactory 是顶层容器（根容器），不能被实例化，它定义了所有 IoC 容器 必须遵从的⼀套原则，具体的容器实现可以增加额外的功能，⽐如我们常⽤到的ApplicationContext，其下更具体的实现如 **ClassPathXmlApplicationContext 包含了解析 xml 等⼀系列的内容，AnnotationConfigApplicationContext 则是包含了注解解析等⼀系列的内容 **。 Spring IoC 容器继承体系⾮常聪明，需要使⽤哪个层次⽤哪个层次即可，不必使⽤功能⼤⽽全的。
BeanFactory 顶级接⼝⽅法栈如下  

![image-20230319205737511](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-beanFactory.png)

BeanFactory容器的继承关系

![image-20230319205810276](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-beanfactory%E7%BB%A7%E6%89%BF%E5%85%B3%E7%B3%BB%E7%B1%BB%E5%9B%BE.png)

通过其接⼝设计，我们可以看到我们⼀贯使⽤的 ApplicationContext 除了继承BeanFactory的⼦接⼝，还继承了ResourceLoader、 MessageSource等接⼝，因此其提供的功能也就更丰富了。下⾯我们以 ClasspathXmlApplicationContext 为例，深⼊源码说明 IoC 容器的初始化流程。  

#### 1.2 Bean生命周期关键时机点

测试思路： 创建一个类，让其实现几个特殊的接口，并分别在接口实现构造器、接口方法中断点、观察线程调用栈，分析bean帝乡创建和管理关键点的触发时机。

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.DisposableBean;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.stereotype.Component;

public class LnlrBean implements InitializingBean{
    /**
    * 构造函数
    */
    public LnlrBean(){
    	System.out.println("LnlrBean 构造器...");
    }
    /**
    * InitializingBean 接⼝实现
    */
    public void afterPropertiesSet() throws Exception {
    	System.out.println("LnlrBean afterPropertiesSet...");
    }
}
```

BeanPostProcessor接口实现类

```java

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;


public class MyBeanPostProcessor implements BeanPostProcessor {
    public MyBeanPostProcessor() {
        System.out.println("BeanPostProcessor 实现类构造函数...");
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName)
            throws BeansException {
        if ("lagouBean".equals(beanName)) {
            System.out.println("BeanPostProcessor 实现类postProcessBeforeInitialization ⽅法被调⽤中......");
        }
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName)
            throws BeansException {
        if ("lagouBean".equals(beanName)) {
            System.out.println("BeanPostProcessor 实现类postProcessAfterInitialization ⽅法被调⽤中......");
        }
        return bean;
    }
}
```

BeanFactoryPostProcessor接口

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;

public class MyBeanFactoryPostProcessor implements BeanFactoryPostProcessor {
    public MyBeanFactoryPostProcessor() {
        System.out.println("BeanFactoryPostProcessor的实现类构造函数...");
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        System.out.println("BeanFactoryPostProcessor的实现⽅法调⽤中......");
    }
}
```

测试启动类

```java
/**
* Ioc 容器源码分析基础案例
*/
@Test
public void testIoC() {
ApplicationContext applicationContext = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
LnlrBean lnlrBean = applicationContext.getBean(LnlrBean.class);
System.out.println(lnlrBean);
}
```

跟踪流程：

1. 分析bean的创建是在容器初始化钱还是在getBean时

   其实这个不用分析就能知道，前面学习过spring是默认单例模式的，并且延迟加载模式是设置false，所以能明确的知道在getBean之前，bean就肯定已经是创建了的。

2. 分析构造函数的调用情况

   构造函数的初始化调用是在AbstractApplicationContext类的refresh方法中，是finishBeanFactorInitialization(beanFactory)初

3. 分析 InitializingBean 之 afterPropertiesSet 初始化⽅法调⽤情况  

​			InitializingBean中afterPropertiesSet ⽅法的调⽤时机也是在AbstractApplicationContext类refresh⽅法的finishBeanFactoryInitialization(beanFactory);  

 4. 分析BeanFactoryPostProcessor 初始化和调⽤情况  

    分别在构造函数、 postProcessBeanFactory ⽅法处打断点，观察调⽤栈，发现
    BeanFactoryPostProcessor 初始化在AbstractApplicationContext类refresh⽅法的
    invokeBeanFactoryPostProcessors(beanFactory);  

 5. 分析 BeanPostProcessor 初始化和调⽤情况  

​       分别在构造函数、 postProcessBeanFactory ⽅法处打断点，观察调⽤栈，发现

​       BeanPostProcessor 初始化在AbstractApplicationContext类refresh⽅法的registerBeanPostProcessors(beanFactory);

​        postProcessBeforeInitialization 调⽤在AbstractApplicationContext类refresh⽅法的finishBeanFactoryInitialization(beanFactory);
​        postProcessAfterInitialization 调⽤在AbstractApplicationContext类refresh⽅法的finishBeanFactoryInitialization(beanFactory);  

**结论:Bean对象创建的⼏个关键时机点代码层级的调⽤都在AbstractApplicationContext 类 的 refresh ⽅法中，可⻅这个⽅法对于Spring IoC 容器初始化来说相当关键，汇总如下：  **

| 关键点                            | 触发代码                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| 构造器                            | refresh#finishBeanFactoryInitialization(beanFactory)(beanFactory) |
| BeanFactoryPostProcessor 初始化   | refresh#invokeBeanFactoryPostProcessors(beanFactory)         |
| BeanFactoryPostProcessor ⽅法调⽤ | refresh#invokeBeanFactoryPostProcessors(beanFactory)         |
| BeanPostProcessor 初始化          | registerBeanPostProcessors(beanFactory)                      |
| BeanPostProcessor ⽅法调⽤        | refresh#finishBeanFactoryInitialization(beanFactory)         |



#### 1.3 Spring IOC容器的初始化主流程

由上面的分析可以知道，Spring IOC容器初始化的关键节点就在AbstractApplicationContext类中的refresh方法，这个就是大名鼎鼎的refresh。

```java
@Override
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // 第⼀步：刷新前的预处理
        prepareRefresh();
        /*
        第⼆步：
        获取BeanFactory；默认实现是DefaultListableBeanFactory
		加载BeanDefition 并注册到 BeanDefitionRegistry
		*/
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
        // 第三步： BeanFactory的预准备⼯作（BeanFactory进⾏⼀些设置，⽐如context的类加载器等）
        prepareBeanFactory(beanFactory);
        try {
            // 第四步： BeanFactory准备⼯作完成后进⾏的后置处理⼯作
            postProcessBeanFactory(beanFactory);
            // 第五步：实例化并调⽤实现了BeanFactoryPostProcessor接⼝的Bean
            invokeBeanFactoryPostProcessors(beanFactory);
            // 第六步：注册BeanPostProcessor（Bean的后置处理器），在创建bean的前后等执⾏
            registerBeanPostProcessors(beanFactory);
            // 第七步：初始化MessageSource组件（做国际化功能；消息绑定，消息解析）；
            initMessageSource();
            // 第⼋步：初始化事件派发器
            initApplicationEventMulticaster();
            // 第九步：⼦类重写这个⽅法，在容器刷新的时候可以⾃定义逻辑
            onRefresh();
            // 第⼗步：注册应⽤的监听器。就是注册实现了ApplicationListener接⼝的监听器bean
            registerListeners();
            /*
            第⼗⼀步：
            初始化所有剩下的⾮懒加载的单例bean
            初始化创建⾮懒加载⽅式的单例Bean实例（未设置属性）
            填充属性
            初始化⽅法调⽤（⽐如调⽤afterPropertiesSet⽅法、 init-method⽅法）
            调⽤BeanPostProcessor（后置处理器）对实例bean进⾏后置处
            */
            finishBeanFactoryInitialization(beanFactory);
            /*
            第⼗⼆步：
            完成context的刷新。主要是调⽤LifecycleProcessor的onRefresh()⽅法，并且发布事
            件 （ContextRefreshedEvent）
            */
            finishRefresh();
        }
     //.......
    }
}
```



### 2. BeanFactory创建流程

#### 2.1 获取BeanFactory子流程

时序图如下

![微信图片编辑_20230319210035](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-beanfactory%E6%97%B6%E5%BA%8F%E5%9B%BE.jpg)

#### 2.2 BeanDefinition加载解析及注册子流程

关键步骤：

- Resource定位： 针对BeanDefinition的资源定位过程，通俗讲就是找到定义javabean信息的xml文件，并将其封装成Resource对象。

- BeanDefinition载入： 将用户定义的javabean表示出来，通过配置文件等中定义的Bean进行找出来，封装成一个个的BeanDefinition，并且在IOC容器中，就是将bean对象放入到一个map中而已。就是下面这个玩意儿

  ```java
  public class DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory
  		implements ConfigurableListableBeanFactory, BeanDefinitionRegistry, Serializable {
  /** Map of bean definition objects, keyed by bean name. */
  	private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>(256);
  }
  ```

注册BeanDefinition到IOC容器

1. ⼦流程⼊⼝在 AbstractRefreshableApplicationContext#refreshBeanFactory ⽅法中  

![image-20230318153133275](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspirng-beandefinition第一步.png)

2. 依次调⽤多个类的 loadBeanDefinitions ⽅法  —> AbstractXmlApplicationContext  —>
   AbstractBeanDefinitionReader —> XmlBeanDefinitionReader  ⼀直执⾏到XmlBeanDefinitionReader 的 doLoadBeanDefinitions ⽅法  

![image-20230319210209833](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-loadBendefinitions%E7%AC%AC%E4%BA%8C%E6%AD%A5.png)

3. 我们重点观察XmlBeanDefinitionReader 类的 registerBeanDefinitions ⽅法，期间产⽣了多次重载调⽤，我们定位到最后⼀个 

   ![image-20230319210241066](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspirng-%E5%8A%A0%E8%BD%BD%E7%AC%AC%E4%B8%89%E6%AD%A5.png)

此处我们关注两个地⽅：⼀个createRederContext⽅法，⼀个是DefaultBeanDefinitionDocumentReader类的registerBeanDefinitions⽅法，先进⼊createRederContext ⽅法看看  

![image-20230319210305803](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E5%8A%A0%E8%BD%BD%E7%AC%AC%E4%B8%89%E6%AD%A51.png)

我们可以看到，此处 Spring ⾸先完成了 NamespaceHandlerResolver 的初始化。我们再进⼊ registerBeanDefinitions ⽅法中追踪，调⽤了DefaultBeanDefinitionDocumentReader#registerBeanDefinitions ⽅法  

![image-20230319210329630](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-load%E5%8A%A0%E8%BD%BD%E7%AC%AC%E4%B8%89%E6%AD%A52.png)

进⼊ doRegisterBeanDefinitions ⽅法  

![image-20230318153541333](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspirng-doRefisterbeanDefinition%E6%96%B9%E6%B3%95.png)

![image-20230319210401471](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E5%8A%A0%E8%BD%BDdoRegisterBeanDefinitions.png)

进⼊ parseBeanDefinitions ⽅法  

![image-20230319210429981](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspirng-parseBeanDefinitions.png)

进⼊ parseDefaultElement ⽅法  

![image-20230319210454686](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-parseDefaultEletent%E6%96%B9%E6%B3%95.png)

进⼊ processBeanDefinition ⽅法  

![image-20230319210531884](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-processBeanDefinition884.png)

⾄此，注册流程结束，我们发现，所谓的注册就是把封装的 XML 中定义的 Bean信息封装为
BeanDefinition 对象之后放⼊⼀个Map中， BeanFactory 是以 Map 的结构组织这些 BeanDefinition
的。  

![image-20230319210557676](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-map%E6%94%BE%E5%85%A5beanDefinition.png)

可以在DefaultListableBeanFactory中看到此Map的定义  

```java
/** Map of bean definition objects, keyed by bean name. */
private final Map<String, BeanDefinition> beanDefinitionMap = new
ConcurrentHashMap<>(256);
```



3. 时序图![bean时序图](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-bean%E6%97%B6%E5%BA%8F%E5%9B%BE.png)

### 3. Bean创建流程

通过最开始的关键时机点分析，我们知道Bean创建⼦流程⼊⼝在
AbstractApplicationContext#refresh()⽅法的finishBeanFactoryInitialization(beanFactory) 处 

![image-20230319210745420](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-finishBeanFactory%E4%BD%8D%E7%BD%AE%E4%BB%A3%E7%A0%81.png)

进⼊finishBeanFactoryInitialization  

![image-20230319210818694](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-finishBeanFactory%E5%88%9D%E5%A7%8B%E5%8C%96.png)

继续进⼊DefaultListableBeanFactory类的preInstantiateSingletons⽅法，我们找到下⾯部分的
代码，看到⼯⼚Bean或者普通Bean，最终都是通过getBean的⽅法获取实例  

![image-20230318162618957](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspring-getbean.png)

继续跟踪下去，我们进⼊到了AbstractBeanFactory类的doGetBean⽅法，这个⽅法中的代码很多，我们直接找到核⼼部分  

![image-20230319210902525](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-doGetBean%E6%A0%B8%E5%BF%83%E6%96%B9%E6%B3%95.png)

接着进⼊到AbstractAutowireCapableBeanFactory类的⽅法，找到以下代码部分  

![image-20230318162927543](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspring-doCreateBean.png)

进⼊doCreateBean⽅法看看，该⽅法我们关注两块重点区域

- 创建Bean实例，此时尚未设置属性  

  ```java
  if (instanceWrapper == null) {
     // 创建实例Bean，但是还没有设置属性
     instanceWrapper = createBeanInstance(beanName, mbd, args);
  }
  ```

- 给Bean填充属性，调⽤初始化⽅法，应⽤BeanPostProcessor后置处理器  

  ```java
          // 初始化实例bean
  		// Initialize the bean instance.
  		Object exposedObject = bean;
  		try {
  		    // bean属性填充
  			populateBean(beanName, mbd, instanceWrapper);
  			// 调用初始化方法，应用BeanPostProcessor后置处理器
  			exposedObject = initializeBean(beanName, exposedObject, mbd);
  		}
  ```



### 4. lazy-init延迟加载机制原理

普通 Bean 的初始化是在容器启动初始化阶段执⾏的，⽽被lazy-init=true修饰的 bean 则是在从容器⾥第⼀次进⾏context.getBean() 时进⾏触发。 Spring 启动的时候会把所有bean信息(包括XML和注解)解析转化成Spring能够识别的BeanDefinition并存到Hashmap⾥供下⾯的初始化时⽤，然后对每个BeanDefinition 进⾏处理，如果是懒加载的则在容器初始化阶段不处理，其他的则在容器初始化阶段进⾏初始化并依赖注⼊。  

```java
@Override
	public void preInstantiateSingletons() throws BeansException {
		if (logger.isTraceEnabled()) {
			logger.trace("Pre-instantiating singletons in " + this);
		}
        // 所有的beanDefinition集合
		List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

		// Trigger initialization of all non-lazy singleton beans...
        // 触发所有的非lazy的bean初始化
		for (String beanName : beanNames) {
            // 获取bean定义
			RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
			if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
				// 判断是否是懒加载bean，并且是需要不是lazy的bean
                if (isFactoryBean(beanName)) {
					Object bean = getBean(FACTORY_BEAN_PREFIX + beanName);
                    // 判断bean是否是Factorybean
					if (bean instanceof FactoryBean) {
						FactoryBean<?> factory = (FactoryBean<?>) bean;
						boolean isEagerInit;
						if (System.getSecurityManager() != null && factory instanceof SmartFactoryBean) {
							isEagerInit = AccessController.doPrivileged(
									(PrivilegedAction<Boolean>) ((SmartFactoryBean<?>) factory)::isEagerInit,
									getAccessControlContext());
						}
						else {
							isEagerInit = (factory instanceof SmartFactoryBean &&
									((SmartFactoryBean<?>) factory).isEagerInit());
						}
						if (isEagerInit) {
							getBean(beanName);
						}
					}
				}
				else {
                    //如果是普通bean就记性初始化并依赖注入，这里getBean(beanName)接下来触发的逻辑和懒加载context.getBean(beanName)时触发的一样
					getBean(beanName);
				}
			}
		}
        // .......略
	}
```

总结：

- 对于修饰为lazy-init的bean spring在容器初始化的阶段不会进行init，并且不会依赖注入，只有在第一次getBean的 时候才会初始化并且依赖注入
- 对于非lazy的bean，getBean的时候会从缓存中获取，因为refresh方法的时候就已经初始化完成，并且缓存到map中



### 5. Spring IOC循环依赖问题

spring的循环依赖是一个很经典的面试问题，看我们如何一步步道来

#### 5.1 啥是循环依赖

循环依赖就是循环引用，就是多个Bean进行相互引用，你中有我，我中有你，形成了一个环状的样子。

![image-20230318164911944](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspring-%E5%BE%AA%E7%8E%AF%E4%BE%9D%E8%B5%96%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

需要注意的是： 循环依赖不是指函数间的相互调用，是对象间的相互引用，循环调用其实是一个死循环，除非有终结条件。



Spring的循环依赖场景：

- 构造器的循环依赖（构造器注入,是无法解决的）
- Field属性的循环依赖（Set注入）

其中，**构造器的循环依赖是无法解决的，只能抛出BeanCurrentlyInCreationException 异常 ，在解决属性循环依赖的时，Spring是采用了提前暴露对象的方法。**



#### 5.2 循环依赖的处理机制

- 单例bean构造器循环依赖： 无法解决

- prototype原型bean循环依赖： 无法解决

  对于原型bean的初始化过程中不论是通过构造器还是Field属性setXX方式的循环依赖，Spring都无法处理，直接报错处理。

  AbstractBeanFactory.doGetBean方法中

  ```java
  // Fail if we're already creating this bean instance:
  // We're assumably within a circular reference.
  if (isPrototypeCurrentlyInCreation(beanName)) {
  	throw new BeanCurrentlyInCreationException(beanName);
  }
  ```

  ```java
  	/**
  	 * Return whether the specified prototype bean is currently in creation
  	 * (within the current thread).
  	 * @param beanName the name of the bean
  	 */
  	protected boolean isPrototypeCurrentlyInCreation(String beanName) {
  		Object curVal = this.prototypesCurrentlyInCreation.get();
  		return (curVal != null &&
  				(curVal.equals(beanName) || (curVal instanceof Set && ((Set<?>) curVal).contains(beanName))));
  	}
  ```

  在获取bean之前如果这个原型bean正在被创建则直接抛出异常，原型bean在创建之前会进行标记，这个beanName正在被创建，等创建结束之后就会删除标记。

  ```java
  try {
      //创建原型bean之前添加标记
      beforePrototypeCreation(beanName);
      //创建原型bean
      prototypeInstance = createBean(beanName, mbd, args);
  }finally {
      //创建原型bean之后删除标记
      afterPrototypeCreation(beanName);
  }
  ```

  **总结： Spring原型prototype模型不支持bean的循环依赖。**

- 单例bean通过setXXX或者@Autowired进行循环依赖

  Spring的循环依赖解决理论是根据：Java的引用传递，当获取到对象的引用时，对象的属性是可以延后设置的，但是构造器必须是住在获取引用之前。

Spring通过setXXX或者@Autowired方法解决循环依赖就是通过提前暴露一个ObjectFactory对象来完成的，简单来说ClassA在构造器完成对象的初始化之后，在调用ClassA的setClassB方法之前就把ClassA实例化的对象通过ObjectFactory提前暴露到SpringIOC容器中。

- Spring容器初始化ClassA通过构造器初始化对象后提前暴露到Spring容器

  ```java
  doCreateBean方法中
  // Eagerly cache singletons to be able to resolve circular references
  		// even when triggered by lifecycle interfaces like BeanFactoryAware.
  		boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
  				isSingletonCurrentlyInCreation(beanName));
  		if (earlySingletonExposure) {
  			if (logger.isTraceEnabled()) {
  				logger.trace("Eagerly caching bean '" + beanName +
  						"' to allow for resolving potential circular references");
  			}
              // 将初始化后的对象提前ObjectFactory对象注入到容器中
  			addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
  		}
  ```

- ClassA调用setClassB方法，Spring首先尝试从容器中获取ClassB方法，此时ClassB不存在

- Spring容器初始化ClassB，同时也会将ClassB提前暴露到Spring容器中

- ClassB调用setClassA方法，Spring从容器中获取到ClassA，因为前面已经暴露到Spring中缓存了，因此这里是可以获取到ClassA的实例的

  - ClassA 通过Spring容器获取到ClassB，完成了对象的初始化操作

- 这样ClassA和ClassB都完成了对象的初始化，解决了循环依赖问题。



在具体一点： spring利用了三级缓存来解决循环依赖问题

DefaultSingletonBeanRegistry类

```java
	/** Cache of singleton objects: bean name to bean instance.
    一级缓存：为“Spring 的单例属性”而生，就是个单例池，用来存放已经初始化完成的单例 Bean；
    */
	private final Map<String, Object> singletonObjects = new ConcurrentHashMap<>(256);

	/** Cache of singleton factories: bean name to ObjectFactory.
   三级缓存：为“打破循环”而生，存放的是生成半成品单例 Bean 的工厂方法。
    */
	private final Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>(16);

	/** Cache of early singleton objects: bean name to bean instance. 
	二级缓存：为“解决 AOP”而生，存放的是半成品的 AOP 的单例 Bean；
	*/
	private final Map<String, Object> earlySingletonObjects = new HashMap<>(16);
```

下列代码主要是doGetBean中，获取一个bean的主要的流程

![image-20230318182726182](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgimgspring-getBean.png)

```java
	@Nullable
	protected Object getSingleton(String beanName, boolean allowEarlyReference) {
        //从一级缓存中查询对象
		Object singletonObject = this.singletonObjects.get(beanName);
		if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
			synchronized (this.singletonObjects) {
                // 从二级缓存中获取对象
				singletonObject = this.earlySingletonObjects.get(beanName);
				if (singletonObject == null && allowEarlyReference) {
					ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
					if (singletonFactory != null) {
                        // 三级缓存中寻找对象，放入二级缓存，清除三级缓存
						singletonObject = singletonFactory.getObject();
						this.earlySingletonObjects.put(beanName, singletonObject);
						this.singletonFactories.remove(beanName);
					}
				}
			}
		}
		return singletonObject;
	}
```

doCreateBean中

```java
// Eagerly cache singletons to be able to resolve circular references
// even when triggered by lifecycle interfaces like BeanFactoryAware.
boolean earlySingletonExposure = (mbd.isSingleton() && this.allowCircularReferences &&
      isSingletonCurrentlyInCreation(beanName));
if (earlySingletonExposure) {
   if (logger.isTraceEnabled()) {
      logger.trace("Eagerly caching bean '" + beanName +
            "' to allow for resolving potential circular references");
   }
   // 添加到三级缓存，如下
   addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
}
```

```java
	/**
	 * Add the given singleton factory for building the specified singleton
	 * if necessary.
	 * <p>To be called for eager registration of singletons, e.g. to be able to
	 * resolve circular references.
	 * @param beanName the name of the bean
	 * @param singletonFactory the factory for the singleton object
	 */
	protected void addSingletonFactory(String beanName, ObjectFactory<?> singletonFactory) {
		Assert.notNull(singletonFactory, "Singleton factory must not be null");
		synchronized (this.singletonObjects) {
			if (!this.singletonObjects.containsKey(beanName)) {
               // 添加bean到三级缓存
				this.singletonFactories.put(beanName, singletonFactory);
				this.earlySingletonObjects.remove(beanName);
				this.registeredSingletons.add(beanName);
			}
		}
	}
```

小结：提前暴露对象可以解决循环依赖问题，第三级缓存是为了解决 aop 场景的循环依赖问题。第一级和第二级缓存理论上是可以合并的，但是弊大于利，会让编码变的复杂。第三级缓存在没有 aop 的场景下理论上可以移除。



## 五、Spring AOP应用

AOP本质：在不改变原有业务逻辑的情况下增强横切逻辑，横切逻辑代码往往是权限校验代码、⽇志代码、事务控制代码、性能监控代码。  

### 5.1 aop的相关俗语

#### 5.1.1 业务主线

在讲解AOP术语之前，我们先来看⼀下下⾯这两张图，它们就是第三部分案例需求的扩展（针对这些扩展的需求，我们只进⾏分析，在此基础上去进⼀步回顾AOP，不进⾏实现）  

![image-20230318213215849](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-aop%E6%A8%AA%E5%88%87.png)

上图描述的就是未采⽤AOP思想设计的程序，当我们红⾊框中圈定的⽅法时，会带来⼤量的重复劳动。程序中充斥着⼤量的重复代码，使我们程序的独⽴性很差。下图中是采⽤了AOP思想设计的程序，它把红框部分的代码抽取出来的同时，运⽤动态代理技术，在运⾏期对需要使⽤的业务逻辑⽅法进⾏增强。  

![image-20230318213306518](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E5%88%87%E9%9D%A2%E5%A2%9E%E5%BC%BA.png)



#### 5.1.2 aop术语

| 名词               | 解释                                                         |
| ------------------ | ------------------------------------------------------------ |
| Joinpoint(连 接点) | 它指的是那些可以⽤于把增强代码加⼊到业务主线中的点，那么由上图中我们可以看出，这些点指的就是⽅法。在⽅法执⾏的前后通过动态代理技术加⼊增强的 代码。在Spring框架AOP思想的技术实现中，也只⽀持⽅法类型的连接点。 |
| Pointcut(切 ⼊点)  | 它指的是那些已经把增强代码加⼊到业务主线进来之后的连接点。由上图中，我 们看出表现层 transfer ⽅法就只是连接点，因为判断访问权限的功能并没有对 其增强。 |
| Advice(通知/增强)  | 它指的是切⾯类中⽤于提供增强功能的⽅法。并且不同的⽅法增强的时机是不⼀ 样的。⽐如，开启事务肯定要在业务⽅法执⾏之前执⾏；提交事务要在业务⽅法正常执⾏之后执⾏，⽽回滚事务要在业务⽅法执⾏产⽣异常之后执⾏等等。那么 这些就是通知的类型。其分类有： 前置通知 后置通知 异常通知 最终通知 环绕通 知。 |
| Target(⽬标 对象)  | 它指的是代理的⽬标对象。即被代理对象。                       |
| Proxy(代理)        | 它指的是⼀个类被AOP织⼊增强后，产⽣的代理类。即代理对象。    |
| Weaving(织 ⼊)     | 它指的是把增强应⽤到⽬标对象来创建新的代理对象的过程。 spring采⽤动态代 理织⼊，⽽AspectJ采⽤编译期织⼊和类装载期织⼊。 |
| Aspect(切 ⾯)      | 它指定是增强的代码所关注的⽅⾯，把这些相关的增强代码定义到⼀个类中，这 个类就是切⾯类。例如，事务切⾯，它⾥⾯定义的⽅法就是和事务相关的，像开 启事务，提交事务，回滚事务等等，不会定义其他与事务⽆关的⽅法。我们前⾯ 的案例中 TrasnactionManager 就是⼀个切⾯。 |

连接点：⽅法开始时、结束时、正常运⾏完毕时、⽅法异常时等这些特殊的时机点，我们称之为连接点，项⽬中每个⽅法都有连接点，连接点是⼀种候选点 

切入点： 指定AOP思想想要影响的具体⽅法是哪些，描述感兴趣的⽅法  

Advice增强：
	第⼀个层次：指的是横切逻辑
	第⼆个层次：⽅位点（在某⼀些连接点上加⼊横切逻辑，那么这些连接点就叫做⽅位点，描述的是具的特殊时机）

Aspect切⾯：切⾯概念是对上述概念的⼀个综合
Aspect切⾯= 切⼊点+增强

= 切⼊点（锁定⽅法） + ⽅位点（锁定⽅法中的特殊时机） + 横切逻辑

**众多的概念，⽬的就是为了锁定要在哪个地⽅插⼊什么横切逻辑代码**  



### 5.2 Spring中的aop的代理选择

Spring 实现AOP思想使⽤的是动态代理技术
默认情况下， Spring会根据被代理对象是否实现接⼝来选择使⽤JDK还是CGLIB。当被代理对象没有实现任何接⼝时， Spring会选择CGLIB。当被代理对象实现了接⼝， Spring会选择JDK官⽅的代理技术，不过我们可以通过配置的⽅式，让Spring强制使⽤CGLIB。  





### 5.3 Spring中AOP的配置⽅式  

在Spring的AOP配置中，也和IoC配置⼀样，⽀持3类配置⽅式。
第⼀类：使⽤XML配置
第⼆类：使⽤XML+注解组合配置
第三类：使⽤纯注解配置  



### 5.4 Spring中AOP的实现

需求：横切逻辑代码是打印⽇志，希望把打印⽇志的逻辑织⼊到⽬标⽅法的特定位置(service层transfer⽅法)  

介绍注解的方式：

```java
@EnableAspectJAutoProxy //开启spring对注解AOP的⽀持
```



配置切入点相关，主要有切入点，然后各种通知就行

```java
@Component
@Aspect
public class LogUtil {
    /**
     * 我们在xml中已经使⽤了通⽤切⼊点表达式，供多个切⾯使⽤，那么在注解中如何使⽤呢？* 第⼀步：编写⼀个⽅法
     * 第⼆步：在⽅法使⽤@Pointcut注解
     * 第三步：给注解的value属性提供切⼊点表达式
     * 细节：
     * 1.在引⽤切⼊点表达式时，必须是⽅法名+()，例如"pointcut()"。
     * 2.在当前切⾯中使⽤，可以直接写⽅法名。在其他切⾯中使⽤必须是全限定⽅法名。
     */
    @Pointcut("execution(* com.lnlr.service.impl.*.*(..))")
    public void pointcut() {
    }

    @Before("pointcut()")
    public void beforePrintLog(JoinPoint jp) {
        Object[] args = jp.getArgs();
        System.out.println("前置通知： beforePrintLog，参数是： " + Arrays.toString(args));
    }

    @AfterReturning(value = "pointcut()", returning = "rtValue")
    public void afterReturningPrintLog(Object rtValue) {
        System.out.println("后置通知： afterReturningPrintLog，返回值是： " + rtValue);
    }

    @AfterThrowing(value = "pointcut()", throwing = "e")
    public void afterThrowingPrintLog(Throwable e) {
        System.out.println("异常通知： afterThrowingPrintLog，异常是： " + e);
    }

    @After("pointcut()")
    public void afterPrintLog() {
        System.out.println("最终通知： afterPrintLog");
    }

    /**
     * 环绕通知
     *
     * @param pjp
     * @return
     */
    @Around("pointcut()")
    public Object aroundPrintLog(ProceedingJoinPoint pjp) {
        //定义返回值
        Object rtValue = null;
        try {
            //前置通知
            System.out.println("前置通知");
            //1.获取参数
            Object[] args = pjp.getArgs();
            //2.执⾏切⼊点⽅法
            rtValue = pjp.proceed(args);
            //后置通知
            System.out.println("后置通知");
        } catch (Throwable t) {
            //异常通知
            System.out.println("异常通知");
            t.printStackTrace();
        } finally {
            //最终通知
            System.out.println("最终通知");
        }
        return rtValue;
    }
}
```



### 5.5 Spring声明式事务的支持

编程式事务： 在业务代码中添加事务控制代码，这样的事务控制机制就叫做编程式事务
声明式事务： 通过xml或者注解配置的⽅式达到事务控制的⽬的，叫做声明式事务  

#### 5.5.1 事务回顾

##### 5.5.1.1 事务的概念

事务指逻辑上的⼀组操作，组成这组操作的各个单元，要么全部成功，要么全部不成功。从⽽确保了数
据的准确与安全。
例如： A——B转帐，对应于如下两条sql语句:  

```sql
/*转出账户减钱*/
update account set money=money-100 where name=‘a’;
/**转⼊账户加钱*/
update account set money=money+100 where name=‘b’;
```

这两条语句的执⾏，要么全部成功，要么全部不成功。  

##### 5.5.1.2 事务的四大特性

| 特性                 | 含义                                                         | 样例                                                         |
| -------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 原子性（Atomicity）  | 原⼦性是指事务是⼀个不可分割的⼯作单位，事务中的操作要么都发⽣，要么都不发生。<br/>从操作的⻆度来描述，事务中的各个操作要么都成功要么都失败 |                                                              |
| ⼀致性Consistency）  | 事务必须使数据库从⼀个⼀致性状态变换到另外⼀个⼀致性状态。   | 例如转账前A有1000， B有1000。转账后A+B也得是2000。<br/>⼀致性是从数据的⻆度来说的，（1000， 1000） （900， 1100），不应该出现（900， 1000） |
| 隔离性（Isolation）  | 事务的隔离性是多个⽤户并发访问数据库时，数据库为每⼀个⽤户开启的事务，<br/>每个事务不能被其他事务的操作数据所⼲扰，多个并发事务之间要相互隔离。 | ⽐如：事务1给员⼯涨⼯资2000，但是事务1尚未被提交，员⼯发起事务2查询⼯资，发现⼯资涨了2000块钱，读到了事务1尚未提交的数据（脏读） |
| 持久性（Durability） | 持久性是指⼀个事务⼀旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发⽣故障<br/>也不应该对其有任何影响。 |                                                              |

##### 5.5.1.3 事务的隔离级别

不考虑隔离级别，会出现以下情况：（以下情况全是错误的），也即为隔离级别在解决事务并发问题

- 脏读：⼀个线程中的事务读到了另外⼀个线程**中未提交**的数据。
- 不可重复读：⼀个线程中的事务读到了另外⼀个线程中已经提交的**update**的数据（前后内容不⼀样）  {

场景：
员⼯A发起事务1，查询⼯资，⼯资为1w，此时事务1尚未关闭
财务⼈员发起了事务2，给员⼯A张了2000块钱， 并且提交了事务
员⼯A通过事务1再次发起查询请求，发现⼯资为1.2w，原来读出来1w读不到了，叫做不可重复读

- 虚读（幻读）：⼀个线程中的事务读到了另外⼀个线程中已经提交的insert或者delete的数据（前后条数不⼀样）

场景：
事务1查询所有⼯资为1w的员⼯的总数，查询出来了10个⼈，此时事务尚未关闭
事务2财务⼈员发起，新来员⼯，⼯资1w，向表中插⼊了2条数据， 并且提交了事务
事务1再次查询⼯资为1w的员⼯个数，发现有12个⼈，⻅了⻤了 



**数据库共定义了四种隔离级别：  **

> | **事务隔离级别**             | 回滚覆盖 |   脏读   | 不可重复读 | 提交覆盖 |   幻读   |
> | ---------------------------- | :------: | :------: | :--------: | :------: | :------: |
> | Read UnCommitted（读未提交） |    ×     | 可能发生 |  可能发生  | 可能发生 | 可能发生 |
> | Read Committed（读已提交）   |    ×     |    ×     |  可能发生  | 可能发生 | 可能发生 |
> | Repeatable Read（重复读）    |    ×     |    ×     |     ×      |    ×     | 可能发生 |
> | Serializable（串行化）       |    ×     |    ×     |     ×      |    ×     |    ×     |

**注意：级别依次升⾼，效率依次降低**
MySQL的默认隔离级别是： REPEATABLE READ
查询当前使⽤的隔离级别： select @@tx_isolation;
设置MySQL事务的隔离级别： set session transaction isolation level xxx; （设置的是当前mysql连接会话的，并不是永久改变的）  



##### 5.5.1.4 事务的传播行为

事务往往在service层进⾏控制，如果出现service层⽅法A调⽤了另外⼀个service层⽅法B， A和B⽅法本身都已经被添加了事务控制，那么A调⽤B的时候，就需要进⾏事务的⼀些协商，这就叫做事务的传播⾏为。
A调⽤B，我们站在B的⻆度来观察来定义事务的传播⾏为  

| 传播名称                  | 说明                                                         |
| ------------------------- | ------------------------------------------------------------ |
| PROPAGATION_REQUIRED      | 如果当前没有事务，就新建⼀个事务，如果已经存在⼀个事务中， 加⼊到这个事务中。**这是最常⻅的选择**。 |
| PROPAGATION_SUPPORTS      | ⽀持当前事务，如果当前没有事务，就以⾮事务⽅式执⾏。         |
| PROPAGATION_MANDATORY     | 使⽤当前的事务，如果当前没有事务，就抛出异常。               |
| PROPAGATION_REQUIRES_NEW  | 新建事务，如果当前存在事务，把当前事务挂起。                 |
| PROPAGATION_NOT_SUPPORTED | 以⾮事务⽅式执⾏操作，如果当前存在事务，就把当前事务挂起。   |
| PROPAGATION_NEVER         | 以⾮事务⽅式执⾏，如果当前存在事务，则抛出异常。             |
| PROPAGATION_NESTED        | 如果当前存在事务，则在嵌套事务内执⾏。如果当前没有事务，则 执⾏与PROPAGATION_REQUIRED类似的操作。 |



#### 5.5.2 Spring中的事务API

mybatis: sqlSession.commit();
hibernate: session.commit();  

**PlatformTransactionManager  **

```java
public interface PlatformTransactionManager {
/**作⽤
* 获取事务状态信息
*/
TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
throws TransactionException;
/**
* 提交事务
*/
void commit(TransactionStatus status) throws TransactionException;
/**
* 回滚事务
*/
void rollback(TransactionStatus status) throws TransactionException;
}
```

作⽤
此接⼝是Spring的事务管理器核⼼接⼝。 Spring本身并不⽀持事务实现，只是负责提供标准，应⽤底层⽀持什么样的事务，需要提供具体实现类。此处也是策略模式的具体应⽤。在Spring框架中，也为我们内置了⼀些具体策略，例如： DataSourceTransactionManager , HibernateTransactionManager 等等。（ 和 HibernateTransactionManager 事务管理器在 spring-orm-5.1.12.RELEASE.jar 中）Spring JdbcTemplate（数据库操作⼯具）、 Mybatis（mybatis-spring.jar） ————>DataSourceTransactionManagerHibernate框架 ——————> HibernateTransactionManager
DataSourceTransactionManager 归根结底是横切逻辑代码，声明式事务要做的就是使⽤Aop（动态代理）来将事务控制逻辑织⼊到业务代码  

注解模式：

```java
@EnableTransactionManagement//开启spring注解事务的⽀持
```



## 六、Spring AOP源码深度剖析

### 1. 代理对象的创建

#### 1.1 aop基础

结论： Spring容器在启动的时候，在初始化过程中目标Bean就已经完成了代理，返回代理对象



#### 1.2 代理对象的创建

AbstractAutowireCapableBeanFactory#initializeBean(java.lang.String, java.lang.Object,
org.springframework.beans.factory.support.RootBeanDefinition)  

```java
protected Object initializeBean(String beanName, Object bean, @Nullable RootBeanDefinition mbd) {
		if (System.getSecurityManager() != null) {
			AccessController.doPrivileged((PrivilegedAction<Object>) () -> {
				invokeAwareMethods(beanName, bean);
				return null;
			}, getAccessControlContext());
		}
		else {
			invokeAwareMethods(beanName, bean);
		}

		Object wrappedBean = bean;
		if (mbd == null || !mbd.isSynthetic()) {
            // 执⾏所有的BeanPostProcessor#postProcessBeforeInitialization 初始化之前的处理器⽅法
			wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
		}

		try {
            // 这⾥就开始执⾏afterPropertiesSet（实现了InitializingBean接⼝）⽅法和initMethod
			invokeInitMethods(beanName, wrappedBean, mbd);
		}
		catch (Throwable ex) {
			throw new BeanCreationException(
					(mbd != null ? mbd.getResourceDescription() : null),
					beanName, "Invocation of init method failed", ex);
		}
		if (mbd == null || !mbd.isSynthetic()) {
            // 整个Bean初始化完成，执⾏后置处理器⽅法
			wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
		}

		return wrappedBean;
	}
```

AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterInitialization 

```java
	@Override
	public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)
			throws BeansException {

		Object result = existingBean;
        // 循环执行后置处理器
		for (BeanPostProcessor processor : getBeanPostProcessors()) {
			Object current = processor.postProcessBeforeInitialization(result, beanName);
			if (current == null) {
				return result;
			}
			result = current;
		}
		return result;
	}
```

创建代理对象的后置处理器AbstractAutoProxyCreator#postProcessAfterInitialization  

```java
    public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
        if (bean != null) {
            // 检查该类是否已经暴露过（可能已经创建）
            // 当真正需要创建时，就没有必须带代理一次已经代理过的对象，避免重复创建
            Object cacheKey = this.getCacheKey(bean.getClass(), beanName);
            if (this.earlyProxyReferences.remove(cacheKey) != bean) {
                return this.wrapIfNecessary(bean, beanName, cacheKey);
            }
        }

        return bean;
    }
```

AbstractAutoProxyCreator#wrapIfNecessary  

```java
    protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
        // targetSourcedBeans包含，说明前⾯创建过
        if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
            return bean;
        } else if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
            return bean;
        } else if (!this.isInfrastructureClass(bean.getClass()) && !this.shouldSkip(bean.getClass(), beanName)) {
             //得到所有候选Advisor，对Advisors和bean的⽅法双层遍历匹配，最终得到⼀个List<Advisor>，即specificInterceptors
            Object[] specificInterceptors = this.getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, (TargetSource)null);
            if (specificInterceptors != DO_NOT_PROXY) {
                this.advisedBeans.put(cacheKey, Boolean.TRUE);
                // 重点: 创建代理对象
                Object proxy = this.createProxy(bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
                this.proxyTypes.put(cacheKey, proxy.getClass());
                return proxy;
            } else {
                this.advisedBeans.put(cacheKey, Boolean.FALSE);
                return bean;
            }
        } else {
            this.advisedBeans.put(cacheKey, Boolean.FALSE);
            return bean;
        }
    }
```

AbstractAutoProxyCreator#createProxy  

```java
 protected Object createProxy(Class<?> beanClass, @Nullable String beanName, @Nullable Object[] specificInterceptors, TargetSource targetSource) {
        if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
            AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory)this.beanFactory, beanName, beanClass);
        }
		// 创建代理的工作交给ProxyFactory
        ProxyFactory proxyFactory = new ProxyFactory();
        proxyFactory.copyFrom(this);
     // 根据⼀些情况判断是否要设置proxyTargetClass=true
        if (!proxyFactory.isProxyTargetClass()) {
            if (this.shouldProxyTargetClass(beanClass, beanName)) {
                proxyFactory.setProxyTargetClass(true);
            } else {
                this.evaluateProxyInterfaces(beanClass, proxyFactory);
            }
        }
		// 把指定和通⽤拦截对象合并, 并都适配成Advisor
        Advisor[] advisors = this.buildAdvisors(beanName, specificInterceptors);
        proxyFactory.addAdvisors(advisors);
    	 // 设置参数
        proxyFactory.setTargetSource(targetSource);
        this.customizeProxyFactory(proxyFactory);
        proxyFactory.setFrozen(this.freezeProxy);
        if (this.advisorsPreFiltered()) {
            proxyFactory.setPreFiltered(true);
        }
		// 上⾯准备做完就开始创建代理
        return proxyFactory.getProxy(this.getProxyClassLoader());
    }
```

继续跟进getProxy

```java
// ⽤ProxyFactory创建AopProxy, 然后⽤AopProxy创建Proxy, 所以这⾥重要的是看获取的AopProxy
// 对象是什么,
// 然后进去看怎么创建动态代理, 提供了两种： jdk proxy, cglib   
public Object getProxy(@Nullable ClassLoader classLoader) {
        return this.createAopProxy().getProxy(classLoader);
    }
```

![image-20230318221852004](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-aop%E4%BB%A3%E7%90%86%E7%94%9F%E6%88%90%E7%9A%84%E6%9C%80%E7%BB%88%E4%BD%BF%E7%94%A8.png)

```java
	/**
	 * Subclasses should call this to get a new AOP proxy. They should <b>not</b>
	 * create an AOP proxy with {@code this} as an argument.
	 */
	protected final synchronized AopProxy createAopProxy() {
		if (!this.active) {
			activate();
		}
		return getAopProxyFactory().createAopProxy(this);
	}

```

流程就是⽤AopProxyFactory创建AopProxy, 再⽤AopProxy创建代理对象，这⾥的AopProxyFactory默认是DefaultAopProxyFactory，看他的createAopProxy⽅法  

```java
public class DefaultAopProxyFactory implements AopProxyFactory, Serializable {

	@Override
	public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
		if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
			Class<?> targetClass = config.getTargetClass();
			if (targetClass == null) {
				throw new AopConfigException("TargetSource cannot determine target class: " +
						"Either an interface or a target is required for proxy creation.");
			}
			if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
				return new JdkDynamicAopProxy(config);
			}
			return new ObjenesisCglibAopProxy(config);
		}
		else {
			return new JdkDynamicAopProxy(config);
		}
	}
}
```

这⾥决定创建代理对象是⽤JDK Proxy，还是⽤ Cglib 了，最简单的从使⽤⽅⾯使⽤来说：设置proxyTargetClass=true强制使⽤Cglib 代理，什么参数都不设并且对象类实现了接⼝则默认⽤JDK 代理，如果没有实现接⼝则也必须⽤Cglib  

ProxyFactory#getProxy(java.lang.ClassLoader)
------ CglibAopProxy#getProxy(java.lang.ClassLoader)  

如：cglib中getProxy

```java
@Override
	public Object getProxy(@Nullable ClassLoader classLoader) {
		if (logger.isTraceEnabled()) {
			logger.trace("Creating CGLIB proxy: " + this.advised.getTargetSource());
		}

		try {
			Class<?> rootClass = this.advised.getTargetClass();
			Assert.state(rootClass != null, "Target class must be available for creating a CGLIB proxy");

			Class<?> proxySuperClass = rootClass;
			if (rootClass.getName().contains(ClassUtils.CGLIB_CLASS_SEPARATOR)) {
				proxySuperClass = rootClass.getSuperclass();
				Class<?>[] additionalInterfaces = rootClass.getInterfaces();
				for (Class<?> additionalInterface : additionalInterfaces) {
					this.advised.addInterface(additionalInterface);
				}
			}

			// Validate the class, writing log messages as necessary.
			validateClassIfNecessary(proxySuperClass, classLoader);
			// 配置 Cglib 增强
			// Configure CGLIB Enhancer...
			Enhancer enhancer = createEnhancer();
			if (classLoader != null) {
				enhancer.setClassLoader(classLoader);
				if (classLoader instanceof SmartClassLoader &&
						((SmartClassLoader) classLoader).isClassReloadable(proxySuperClass)) {
					enhancer.setUseCache(false);
				}
			}
			enhancer.setSuperclass(proxySuperClass);
			enhancer.setInterfaces(AopProxyUtils.completeProxiedInterfaces(this.advised));
			enhancer.setNamingPolicy(SpringNamingPolicy.INSTANCE);
			enhancer.setStrategy(new ClassLoaderAwareGeneratorStrategy(classLoader));

			Callback[] callbacks = getCallbacks(rootClass);
			Class<?>[] types = new Class<?>[callbacks.length];
			for (int x = 0; x < types.length; x++) {
				types[x] = callbacks[x].getClass();
			}
			// fixedInterceptorMap only populated at this point, after getCallbacks call above
			enhancer.setCallbackFilter(new ProxyCallbackFilter(
					this.advised.getConfigurationOnlyCopy(), this.fixedInterceptorMap, this.fixedInterceptorOffset));
			enhancer.setCallbackTypes(types);
			// ⽣成代理类，并且创建⼀个代理类的实例
			// Generate the proxy class and create a proxy instance.
			return createProxyClassAndInstance(enhancer, callbacks);
		}
		catch (CodeGenerationException | IllegalArgumentException ex) {
			throw new AopConfigException("Could not generate CGLIB subclass of " + this.advised.getTargetClass() +
					": Common causes of this problem include using a final class or a non-visible class",
					ex);
		}
		catch (Throwable ex) {
			// TargetSource.getTarget() failed
			throw new AopConfigException("Unexpected AOP exception", ex);
		}
	}
```

aop源码分析调用记录

```java
org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory#initializeBean
调⽤
org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory#applyBeanPostProcessorsAfterInitialization
调⽤
org.springframework.aop.framework.autoproxy.AbstractAutoProxyCreator#postProcessAfterInitialization（后置处理器AbstractAutoProxyCreator完成bean代理对象创建）
调⽤
org.springframework.aop.framework.autoproxy.AbstractAutoProxyCreator#wrapIfNecessary
调⽤
org.springframework.aop.framework.autoproxy.AbstractAutoProxyCreator#createProxy （在这⼀步把委托对象的aop增强和通⽤拦截进⾏合并，最终给代理对象）
调⽤
org.springframework.aop.framework.DefaultAopProxyFactory#createAopProxy
调⽤
org.springframework.aop.framework.CglibAopProxy#getProxy(java.lang.ClassLoader)
```



### 2. Spring声明式事务控制

声明式事务很⽅便，尤其纯注解模式，仅仅⼏个注解就能控制事务了
思考：这些注解都做了什么？好神奇！
@EnableTransactionManagement @Transactional  

#### 2.1 @EnableTransactionManager

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(TransactionManagementConfigurationSelector.class)
public @interface EnableTransactionManagement {}
```

@EnableTransactionManagement 注解使⽤ @Import 标签引⼊了
TransactionManagementConfigurationSelector类，这个类⼜向容器中导⼊了两个重要的组件 

```java
public class TransactionManagementConfigurationSelector extends AdviceModeImportSelector<EnableTransactionManagement> {

	/**
	 * Returns {@link ProxyTransactionManagementConfiguration} or
	 * {@code AspectJ(Jta)TransactionManagementConfiguration} for {@code PROXY}
	 * and {@code ASPECTJ} values of {@link EnableTransactionManagement#mode()},
	 * respectively.
	 */
	@Override
	protected String[] selectImports(AdviceMode adviceMode) {
		switch (adviceMode) {
			case PROXY:
				return new String[] {AutoProxyRegistrar.class.getName(),
						ProxyTransactionManagementConfiguration.class.getName()};
			case ASPECTJ:
				return new String[] {determineTransactionAspectClass()};
			default:
				return null;
		}
	}

	private String determineTransactionAspectClass() {
		return (ClassUtils.isPresent("javax.transaction.Transactional", getClass().getClassLoader()) ?
				TransactionManagementConfigUtils.JTA_TRANSACTION_ASPECT_CONFIGURATION_CLASS_NAME :
				TransactionManagementConfigUtils.TRANSACTION_ASPECT_CONFIGURATION_CLASS_NAME);
	}

}

```



#### 2.2 加载事务控制组件

- AutoProxyRegistrar

  ```java
  @Override
  	public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {
  		boolean candidateFound = false;
  		Set<String> annTypes = importingClassMetadata.getAnnotationTypes();
  		for (String annType : annTypes) {
  			AnnotationAttributes candidate = AnnotationConfigUtils.attributesFor(importingClassMetadata, annType);
  			if (candidate == null) {
  				continue;
  			}
  			Object mode = candidate.get("mode");
  			Object proxyTargetClass = candidate.get("proxyTargetClass");
  			if (mode != null && proxyTargetClass != null && AdviceMode.class == mode.getClass() &&
  					Boolean.class == proxyTargetClass.getClass()) {
  				candidateFound = true;
  				if (mode == AdviceMode.PROXY) {
  				   // 继续注册了一个类
  					AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry);
  					if ((Boolean) proxyTargetClass) {
  						AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
  						return;
  					}
  				}
  			}
  		}
  		// .....略
  	}
  ```

进入AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry);

```java
	@Nullable
	public static BeanDefinition registerAutoProxyCreatorIfNecessary(BeanDefinitionRegistry registry) {
		return registerAutoProxyCreatorIfNecessary(registry, null);
	}
```

继续进入

```java
	@Nullable
	public static BeanDefinition registerAutoProxyCreatorIfNecessary(
			BeanDefinitionRegistry registry, @Nullable Object source) {

		return registerOrEscalateApcAsRequired(InfrastructureAdvisorAutoProxyCreator.class, registry, source);
	}
```

发现最终，注册了⼀个叫做 InfrastructureAdvisorAutoProxyCreator 的 Bean，⽽这个类是
AbstractAutoProxyCreator 的⼦类，实现了 SmartInstantiationAwareBeanPostProcessor 接⼝ 

```java
public class InfrastructureAdvisorAutoProxyCreator extends AbstractAdvisorAutoProxyCreator {

	@Nullable
	private ConfigurableListableBeanFactory beanFactory;


	@Override
	protected void initBeanFactory(ConfigurableListableBeanFactory beanFactory) {
		super.initBeanFactory(beanFactory);
		this.beanFactory = beanFactory;
	}

	@Override
	protected boolean isEligibleAdvisorBean(String beanName) {
		return (this.beanFactory != null && this.beanFactory.containsBeanDefinition(beanName) &&
				this.beanFactory.getBeanDefinition(beanName).getRole() == BeanDefinition.ROLE_INFRASTRUCTURE);
	}

}
```

继承体系结构如下：

![image-20230318223251326](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-transactionManager%E7%BB%A7%E6%89%BF%E4%BD%93%E7%B3%BB%E7%BB%93%E6%9E%84.png)

它实现了SmartInstantiationAwareBeanPostProcessor，说明这是⼀个后置处理器，⽽且跟spring AOP 开启@EnableAspectJAutoProxy 时注册的 AnnotationAwareAspectJProxyCreator实现的是同⼀个接⼝，所以说，声明式事务是 spring  aop思想的一种应用



- ProxyTransactionManagementConfiguration 组件  

  ```java
  @Configuration(proxyBeanMethods = false)
  @Role(BeanDefinition.ROLE_INFRASTRUCTURE)
  public class ProxyTransactionManagementConfiguration extends AbstractTransactionManagementConfiguration {
  
  	@Bean(name = TransactionManagementConfigUtils.TRANSACTION_ADVISOR_BEAN_NAME)
  	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
  	public BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor(
  			TransactionAttributeSource transactionAttributeSource, TransactionInterceptor transactionInterceptor) {
         // 事务增强器
  		BeanFactoryTransactionAttributeSourceAdvisor advisor = new BeanFactoryTransactionAttributeSourceAdvisor();
          // 向事务增强器中注⼊ 属性解析器 transactionAttributeSource
  		advisor.setTransactionAttributeSource(transactionAttributeSource);
          // 向事务增强器中注⼊ 事务拦截器 transactionInterceptor
  		advisor.setAdvice(transactionInterceptor);
  		if (this.enableTx != null) {
  			advisor.setOrder(this.enableTx.<Integer>getNumber("order"));
  		}
  		return advisor;
  	}
  
  	@Bean
  	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
  	public TransactionAttributeSource transactionAttributeSource() {
          // 属性解析器 transactionAttributeSource
  		return new AnnotationTransactionAttributeSource();
  	}
  
  	@Bean
  	@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
      // 事务拦截器 transactionInterceptor
  	public TransactionInterceptor transactionInterceptor(TransactionAttributeSource transactionAttributeSource) {
  		TransactionInterceptor interceptor = new TransactionInterceptor();
  		interceptor.setTransactionAttributeSource(transactionAttributeSource);
  		if (this.txManager != null) {
  			interceptor.setTransactionManager(this.txManager);
  		}
  		return interceptor;
  	}
  
  }
  ```

  ProxyTransactionManagementConfiguration是⼀个容器配置类，注册了⼀个组件transactionAdvisor，称为事务增强器，然后在这个事务增强器中⼜注⼊了两个属性：transactionAttributeSource，即属性解析器transactionAttributeSource 和 事务拦截器transactionInterceptor 

  -  属性解析器 AnnotationTransactionAttributeSource 部分源码如下  

  ```java
  public class AnnotationTransactionAttributeSource extends AbstractFallbackTransactionAttributeSource
  		implements Serializable {
  
  	private static final boolean jta12Present;
  
  	private static final boolean ejb3Present;
  
  	static {
  		ClassLoader classLoader = AnnotationTransactionAttributeSource.class.getClassLoader();
  		jta12Present = ClassUtils.isPresent("javax.transaction.Transactional", classLoader);
  		ejb3Present = ClassUtils.isPresent("javax.ejb.TransactionAttribute", classLoader);
  	}
  
  	private final boolean publicMethodsOnly;
  	// 注解解析器结合
  	private final Set<TransactionAnnotationParser> annotationParsers;
  ```

  属性解析器有⼀个成员变量是annotationParsers，是⼀个集合，可以添加多种注解解析器(TransactionAnnotationParser)，我们关注 Spring 的注解解析器，部分源码如下  

![image-20230318223829444](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E6%B3%A8%E8%A7%A3%E8%A7%A3%E6%9E%90%E5%99%A8%E7%BB%93%E5%90%88%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

属性解析器的作⽤之⼀就是⽤来解析@Transaction注解 

TransactionInterceptor 事务拦截器，部分源码如下  

![image-20230318224006633](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-%E4%BA%8B%E5%8A%A1transactionInterecptor.png)

上述组件如何关联起来的？  

- 事务拦截器实现了MethodInterceptor接⼝，追溯⼀下上⾯提到的InfrastructureAdvisorAutoProxyCreator后置处理器，它会在代理对象执⾏⽬标⽅法的时候获取其拦截器链，⽽拦截器链就是这个TransactionInterceptor，这就把这两个组件联系起来；
- 构造⽅法传⼊PlatformTransactionManager(事务管理器)、 TransactionAttributeSource(属性解析器)，但是追溯⼀下上⾯贴的ProxyTransactionManagementConfiguration的源码，在注册事务拦截器的时候并没有调⽤这个带参构造⽅法，⽽是调⽤的⽆参构造⽅法，然后再调⽤set⽅法注⼊这两个属性，效果⼀样  

invokeWithinTransaction ⽅法，部分源码如下（关注1、 2、 3、 4 标注处）  

![image-20230318224138563](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/spring/imgspring-iinvokeWithinTransaction%E6%96%B9%E6%B3%95.png)

声明式事务跟踪记录

```xml
@EnableTransactionManagement 注解
1)通过@import引⼊了TransactionManagementConfigurationSelector类它的selectImports⽅法导⼊了另外两个类：
	AutoProxyRegistrar和
	ProxyTransactionManagementConfiguration
2） AutoProxyRegistrar类分析
	⽅法registerBeanDefinitions中，引⼊了其他类，通过
	AopConfigUtils.registerAutoProxyCreatorIfNecessary(registry)引⼊
	InfrastructureAdvisorAutoProxyCreator，它继承了AbstractAutoProxyCreator，是⼀个后置处理器类
3） ProxyTransactionManagementConfiguration 是⼀个添加了@Configuration注解的配置类（注册bean）
	注册事务增强器（注⼊属性解析器、事务拦截器）
		属性解析器： AnnotationTransactionAttributeSource，内部持有了⼀个解析器集合
				Set<TransactionAnnotationParser> annotationParsers;
		具体使⽤的是SpringTransactionAnnotationParser解析器，⽤来解析
@Transactional的事务属性
	事务拦截器： TransactionInterceptor实现了MethodInterceptor接⼝，该通⽤拦截会在产⽣代理对象之前和aop增强合并，最终⼀起影响到代理对象
	TransactionInterceptor的invoke⽅法中invokeWithinTransaction会触发原有业务逻辑调⽤（增强事务）
```

