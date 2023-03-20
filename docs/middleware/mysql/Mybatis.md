# Mybatis框架



## 第一部分： 自定义持久层框架

### 1.1 分析JDBC操作问题

```java
public static void main(String[] args) {
    Connection connection = null;
    PreparedStatement preparedStatement = null;
    ResultSet resultSet = null;
    try {
        // 加载数据库驱动
        Class.forName("com.mysql.jdbc.Driver");
        // 通过驱动管理类获取数据库链接
        connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/mybatis?
        characterEncoding=utf-8", "root", "root");
        // 定义sql语句？表示占位符
        String sql = "select * from user where username = ?";
        // 获取预处理statement
        preparedStatement = connection.prepareStatement(sql);
        // 设置参数，第一个参数为sql语句中参数的序号(从1开始)，第二个参数为设置的参数值
        preparedStatement.setString(1, "tom");
        // 向数据库发出sql执行查询，查询出结果集
        resultSet = preparedStatement.executeQuery();
        // 遍历查询结果集
        while (resultSet.next()) {
            int id = resultSet.getInt("id");
            String username = resultSet.getString("username");
            // 封装User
            user.setId(id);
            user.setUsername(username);
        }
        System.out.println(user);
        }
    } catch (Exception e) {
   		e.printStackTrace();
    } finally {
        // 释放资源
        if (resultSet != null) {
            try {
            	resultSet.close();
            } catch (SQLException e) {
           		e.printStackTrace();
        }
    }
    if (preparedStatement != null) {
    	try {
        	preparedStatement.close();
     	} catch (SQLException e) {
        	e.printStackTrace();
        }
     }
    if (connection != null) {
        try {
        	connection.close();
        } catch (SQLException e) {
        	e.printStackTrace();
        } 
    }
}
```

**JDBC问题总结：**

1. 数据库创建连接、释放频繁造成系统资源浪费，影响性能
2. Sql语句硬编码，代码不易维护，sql变更，代码就要变更
3. 使用preparedStatement向占位符传参数存在硬编码
4. 对结果集硬编码



### 1.2 问题解决的思路

1. 使用数据库连接池初始化连接资源
2. 将sql语句抽取到xml配置文件中
3. 使用反射、内省等底层技术，自动将尸体与表进行属性与字段的自动映射



### 1.3 自定义框架设计

**使用端**

提供核心配置文件

sqlMapConfig.xml: 存放数据源信息，引用mapper.xml

Mapper.xml: sql语句的配置文件



**框架端**

1. 读取配置文件

   读取完成之后以流的形式存在，我们不能将读取到的配置以流的形势存放到内存中，不好操作，可以创建JavaBean的形式来存储

   （1）Configuration: 存放数据库基本信息、Map<唯一标识,Mapper> 唯一标识：namespace+"."+id

   （2）MappedStatement: sql语句、statement类型、输入参数Java类型、输出参数Java类型

2. 解析配置文件

   创建sqlSessionFactoryBuilder类：

   方法： sqlSessionFactory.build()

   第一： 使用dom4j解析配置文件，将解析出来的内容封装到Configuration和MappedStatement中

   第二： 创建SqlSessionFactory的实现类DefaultSqlSession

3. 创建SqlSessionFactory

   方法：openSession(): 获取sqlSession接口的实现类实例对象

4. 创建sqlSession接口及实现类： 主要封装crud方法

   方法： selectList(String statementId,Object param) 查询所有

   selectOne(String statementId,Object param) 查询单个

   具体实现： 封装curd完成对数据库表的查询操作



**涉及到的设计模式**

Builder构建者模式、工厂模式、代理模式



### 1.4 自行义框架实现





### 1.5 自定义框架优化

通过上上述的自定义框架，解决了jdbc操作数据库带来的一些问题： 例如频繁的创建和释放数据库连接、硬编码、手动封装结果集返回等问题。但是还是存在一定的问题？

- dao的实现类中存在重复代码，整个操作的过程模板重复（创建sqlSession，调用sqlSession方法，关闭sqlSession）
- dao的实现类存在硬编码，调用sqlsession方法时，参数statement的id硬编码

解决： 使用代理模式来创建接口的代理对象

```java
@Test
public void test2() throws Exception {
    InputStream resourceAsSteam = Resources.getResourceAsSteam(path：
    "sqlMapConfig.xml")
    SqlSessionFactory build = new
    SqlSessionFactoryBuilder().build(resourceAsSteam);
    SqlSession sqlSession = build.openSession();
    User user = new User();
    user.setld(l);
    user.setUsername("tom");
    //代理对象
    UserMapper userMapper = sqlSession.getMappper(UserMapper.class);
    User userl = userMapper.selectOne(user);
    System・out.println(userl);
}
```

在sqlSession中添加方法

```java
public interface SqlSession {
	public <T> T getMappper(Class<?> mapperClass);
```

实现类

```java
@Override
public <T> T getMappper(Class<?> mapperClass) {
    T o = (T) Proxy.newProxyInstance(mapperClass.getClassLoader(), new Class[] {mapperClass}, new InvocationHandler() {
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            // selectOne
            String methodName = method.getName();
            // className:namespace
            String className = method.getDeclaringClass().getName();
            //statementid
            String key = className+"."+methodName;
            MappedStatement mappedStatement = configuration.getMappedStatementMap().get(key);
            Type genericReturnType = method.getGenericReturnType();
            ArrayList arrayList = new ArrayList<> ();
            //判断是否实现泛型类型参数化
            if(genericReturnType instanceof ParameterizedType){
            	return selectList(key,args);
            	return selectOne(key,args);
            }
        });
    return o;
}
```



## 第二部分： Mybatis相关概念

### 2.1 对象/关系数据库映射(ORM)

ORM全称Object/Relation Mapping：表示对象-关系映射的缩写
ORM完成面向对象的编程语言到关系数据库的映射。当ORM框架完成映射后，程序员既可以利用面向对象程序设计语言的简单易用性，又可以利用关系数据库的技术优势。ORM把关系数据库包装成面向对象的模型。ORM框架是面向对象设计语言与关系数据库发展不同步时的中间解决方案。采用ORM框架后，应用程序不再直接访问底层数据库，而是以面向对象的放松来操作持久化对象，而ORM框架则将这些面向对象的操作转换成底层SQL操作。ORM框架实现的效果：把对持久化对象的保存、修改、删除 等操作，转换为对数据库的操作  



### 2.2 Mybatis的优势

Mybatis是一个半自动化的持久层框架，对开发人员开说，核心sql还是需要自己进行优化，sql和java编码进行分离，功能边界清晰，一个专注业务，一个专注数据。  

![image-20230304103236621](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/imgmybatis-%E5%88%86%E6%9E%90%E8%A7%86%E5%9B%BE.png)

## 第三部分： Mybatis基础应用

### 3.1 快速入门

Mybatis官网地址： https://mybatis.org/mybatis-3/zh/index.html



#### 3.1.1 开发步骤

1. 引入Mybatis依赖
2. 创建表
3. 创建实体类
4. 编写映射文件TMapper.xml
5. 编写核心文件SqlMapConfig.xml
6. 编写测试类



#### 3.1.2 Mybatis的映射文件概述

![image-20230304105236915](C:/Users/18735/Desktop/imgmybatis-%E6%98%A0%E5%B0%84%E6%96%87%E4%BB%B6.png)



#### 3.1 3 入门核心配置文件分析

Mybatis核心配置文件层级关系

- configuration配置
  - properties属性
  - settings设置
  - typeAliases类型别名
  - typeHandlers类型处理器
  - objectFactory对象工厂
  - plugins插件
  - environments环境
    - environment环境变量
      - transactionManager事务管理器
      - dataSource数据源
  - databaseIdProvider 数据库厂商标识
  - mappers映射器

**MyBatis常用配置解析**

##### 1） environment标签

数据库的环境配置，支持多环境配置

![image-20230304105602466](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.png)



其中，事务管理器(transactionManager)类型有两种：

- JDBC： 这个配置就是直接使用了JDBC的提交和回滚设置，它是依赖于从数据源得到的连接来管理事务操作域。
- MANAGED： 这个配置几乎没做什么。它从来不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如JEE应用服务器上下文）。默认情况下它会关闭连接，然后一些容器不希望这样，因此需要将closeConnection属性设置为false来阻止它的默认关闭行为。

其中，数据源(dataSources)有三个类型

- UNPOOLED: 这个数据源的实现只是每次被请求时打开和关闭连接
- POOLED: 这个数据源利用**池**的概念将JDBC连接对象组织起来
- JNDI: 这个数据源的实现为了能在如EJB或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置在一个JNDI上下文引用。

##### 2）mapper标签

该标签的作用是加载映射的，加载方式有如下几种

- 使用相对路径的资源引用，如：

  ```java
  <mapper resource="org/mybatis/builder/AauthorMapper.xml"/>
  ```

- 使用完全限定资源定位符（URL），例如：  

  ```java
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  ```

- 使用映射器接口实现类的完全限定类名，例如：  

  ```java
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  ```

- 将包内的映射器接口实现全部注册为映射器，例如：  

```java
<package name="org.mybatis.builder"/>
```



#### 3.1.4 Mybatis相应API介绍

##### SqlSession工厂构建器SqlSessionFactoryBuilder  

常用API：SqlSessionFactory build(InputStream inputStream)
通过加载mybatis的核心文件的输入流的形式构建一个SqlSessionFactory对象  

```java
String resource = "org/mybatis/builder/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactoryBuilder builder = new SqlSessionFactoryBuilder();
SqlSessionFactory factory = builder.build(inputStream);
```

其中， Resources 工具类，这个类在 org.apache.ibatis.io 包中。Resources 类帮助你从类路径下、文件系统或一个 web URL 中加载资源文件。  

##### SqlSession工厂对象SqlSessionFactory  

SqlSessionFactory 有多个个方法创建SqlSession 实例。常用的有如下两个：  

| 方法                            | 解释                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| openSession()                   | 会默认开启一个事务，但事务不会自动提交，就意味着需要手动提交该事务，更新操作数据才会持久化 |
| openSession(boolean autoCommit) | 是否自动提交，设置为tur，将自动提交事务                      |

##### SqlSession会话对象

SqlSession 实例在 MyBatis 中是非常强大的一个类。在这里你会看到所有执行语句、提交或回滚事务和获取映射器实例的方法。执行语句的方法主要有：  

```java
<T> T selectOne(String statement, Object parameter)
<E> List<E> selectList(String statement, Object parameter)
int insert(String statement, Object parameter)
int update(String statement, Object parameter)
int delete(String statement, Object parameter)
```

操作事务的方式有：

```java
VOid commit()
void rollback()
```



### 3.2 Mybatis的dao层实现

#### 3.2.1 传统开发方式

编写UserDao接口

```java
public interface UserDao{
	List<User> findAll() throws IOException;
}
```

编写UserDaoImpl实现

```java
public class UserDaoImpl implements UserDao{
	public List<User> findAll() throws IOException {
        InputStream resourceAsStream =
        Resources.getResourceAsStream("SqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new
        SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        List<User> userList = sqlSession.selectList("userMapper.findAll");
        sqlSession.close();
        return userList;
    }
}
```

#### 3.2.2 代理开发方式

采用 Mybatis 的代理开发方式实现 DAO 层的开发，这种方式是主流方式
Mapper 接口开发方法只需要程序员编写Mapper 接口（相当于Dao 接口），由Mybatis 框架根据接口定义创建接口的动态代理对象，代理对象的方法体同上边Dao接口实现类方法。Mapper 接口开发需要遵循以下规范：  

1. Mapper.xml文件中的namespace与mapper接口的全限定名相同  
2. Mapper接口方法名和Mapper.xml中定义的每个statement的id相同  
3. Mapper接口方法的输入参数类型和mapper.xml中定义的每个sql的parameterType的类型相同  
4. Mapper接口方法的输出参数类型和mapper.xml中定义的每个sql的resultType的类型相同  

如下图所示：

![image-20230304111145750](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%BB%A3%E7%90%86%E6%96%B9%E5%BC%8F.png)

## 第四部分： Mybatis配置文件深入解析

### 4.1 核心配置文件SqlMapConfig.xml

#### 4.1.1 Mybatis核心配置文件层级关系

- configuration配置

  - properties属性

  - settings设置

  - typeAliases类型别名

  - typeHandlers类型处理器

  - objectFactory对象工厂

  - plugins插件

  - environments环境
    - environment环境变量
      - transactionManager事务管理器
      - dataSource数据源

  - databaseIdProvider 数据库厂商标识

  - mappers映射器

### 4.2 Mybatis常用配置解析

#### 4.2.1 environment标签

数据库的环境配置，支持多环境配置

![image-20230304105602466](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E7%8E%AF%E5%A2%83%E9%85%8D%E7%BD%AE.png)



其中，事务管理器(transactionManager)类型有两种：

- JDBC： 这个配置就是直接使用了JDBC的提交和回滚设置，它是依赖于从数据源得到的连接来管理事务操作域。
- MANAGED： 这个配置几乎没做什么。它从来不提交或回滚一个连接，而是让容器来管理事务的整个生命周期（比如JEE应用服务器上下文）。默认情况下它会关闭连接，然后一些容器不希望这样，因此需要将closeConnection属性设置为false来阻止它的默认关闭行为。

其中，数据源(dataSources)有三个类型

- UNPOOLED: 这个数据源的实现只是每次被请求时打开和关闭连接
- POOLED: 这个数据源利用**池**的概念将JDBC连接对象组织起来
- JNDI: 这个数据源的实现为了能在如EJB或应用服务器这类容器中使用，容器可以集中或在外部配置数据源，然后放置在一个JNDI上下文引用。

#### 4.2.2 mapper标签

该标签的作用是加载映射的，加载方式有如下几种

- 使用相对路径的资源引用，如：

  ```java
  <mapper resource="org/mybatis/builder/AauthorMapper.xml"/>
  ```

- 使用完全限定资源定位符（URL），例如：  

  ```java
  <mapper url="file:///var/mappers/AuthorMapper.xml"/>
  ```

- 使用映射器接口实现类的完全限定类名，例如：  

  ```java
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  ```

- 将包内的映射器接口实现全部注册为映射器，例如：  

```java
<package name="org.mybatis.builder"/>
```



#### 4.2.3 properties标签

实际开发中，习惯将数据源的配置信息单独抽成一个配置文件properties，该标签可以添加额外的配置文件

![image-20230304111709389](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-properties%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)

#### 4.2.4 typeAliases标签

类型别名是Java类型设置的一个短的名称，原来的类型名称配置如下

```java
<select id="findAll",resultType="com.lnlr.domain.User">
	select * from User
</select>
```

配置了typeAliases，将com.lnlr.domain.User更改为uer

```java
<typeAliases>
	<typeAlias type="com.lnlr.domain.User", alias="user"></typeAlias>
</typeAliases>

<select id="findAll",resultType="user">
	select * from User
</select>
```



上面我们是自定义的别名，mybatis框架已经为我们设置好的一些常用的类型的别名  

| 别名    | 数据类型 |
| ------- | -------- |
| string  | String   |
| long    | Long     |
| int     | Integer  |
| double  | Double   |
| boolean | Boolean  |
| ......  | ......   |



### 4.3 映射配置文件mapper.mxl

动态sql： Mybatis 的映射文件中，前面我们的 SQL 都是比较简单的，有些时候业务逻辑复杂时，我们的 SQL是动态变化的，此时在前面的学习中我们的 SQL 就不能满足要求了。
参考的官方文档，描述如下：  

动态 SQL 是 MyBatis 的强大特性之一。如果你使用过 JDBC 或其它类似的框架，你应该能理解根据不同条件拼接 SQL 语句有多痛苦，例如拼接时要确保不能忘记添加必要的空格，还要注意去掉列表最后一个列名的逗号。利用动态 SQL，可以彻底摆脱这种痛苦。

使用动态 SQL 并非一件易事，但借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。

如果你之前用过 JSTL 或任何基于类 XML 语言的文本处理器，你对动态 SQL 元素可能会感觉似曾相识。在 MyBatis 之前的版本中，需要花时间了解大量的元素。借助功能强大的基于 OGNL 的表达式，MyBatis 3 替换了之前的大部分元素，大大精简了元素种类，现在要学习的元素种类比原来的一半还要少。

- if
- choose (when, otherwise)
- trim (where, set)
- foreach

参考mybatis官网地址： https://mybatis.org/mybatis-3/zh/dynamic-sql.html

#### if

使用动态 SQL 最常见情景是根据条件包含 where 子句的一部分。比如：

```xml
<select id="findActiveBlogWithTitleLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
</select>
```

这条语句提供了可选的查找文本功能。如果不传入 “title”，那么所有处于 “ACTIVE” 状态的 BLOG 都会返回；如果传入了 “title” 参数，那么就会对 “title” 一列进行模糊查找并返回对应的 BLOG 结果（细心的读者可能会发现，“title” 的参数值需要包含查找掩码或通配符字符）。

如果希望通过 “title” 和 “author” 两个参数进行可选搜索该怎么办呢？首先，我想先将语句名称修改成更名副其实的名称；接下来，只需要加入另一个条件即可。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```

#### choose、when、otherwise

有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。针对这种情况，MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员精选的 Blog）。

```xml
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```



#### trim、where、set

*where* 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，*where* 元素也会将它们去除。

set 可以做动态set字段更新

trim 定制 *where* 元素的功能



#### foreach

动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：

```xml
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  <where>
    <foreach item="item" index="index" collection="list"
        open="ID in (" separator="," close=")" nullable="true">
          #{item}
    </foreach>
  </where>
</select>
```

*foreach* 元素的功能非常强大，它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！

**提示** 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 *foreach*。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。



## 第五部分： Mybatis复杂映射

### 5.1 一对一查询

#### 5.1.1 一对一查询的模型

用户表和订单表的关系为，一个用户有多个订单，一个订单只从属于一个用户一对一查询的需求：查询一个订单，与此同时查询出该订单所属的用户  

![image-20230304212604157](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%B8%80%E5%AF%B9%E4%B8%80.png)

#### 5.1.2 一对一查询的语句

对应的sql: select * from orders o,user u where o.uid = u.id;

#### 5.1.3 创建Order和User实体

```java
public class Order {
    private int id;
    private Date ordertime;
    private double total;
    //代表当前订单从属于哪一个客户
    private User user;
}
public class User {
    private int id;
    private String username;
    private String password;
    private Date birthday;
}
```

#### 5.1.4 创建OrderMapper接口

```java
public interface OrderMapper{
	List<Order> findAll();
}
```

#### 5.1.5 配置OrderMapper.xml

```xml
<mapper namespace="com.lagou.mapper.OrderMapper">
    <resultMap id="orderMap" type="com.lagou.domain.Order">
        <result column="uid" property="user.id"></result>
        <result column="username" property="user.username"></result>
        <result column="password" property="user.password"></result>
        <result column="birthday" property="user.birthday"></result>
    </resultMap>
    <select id="findAll" resultMap="orderMap">
    	select * from orders o,user u where o.uid=u.id
    </select>
</mapper>
```

其中开可以配置如下：

```xml
<resultMap id="orderMap" type="com.lagou.domain.Order">
    <result property="id" column="id"></result>
    <result property="ordertime" column="ordertime"></result>
    <result property="total" column="total"></result>
    <association property="user" javaType="com.lagou.domain.User">
        <result column="uid" property="id"></result>
        <result column="username" property="username"></result>
        <result column="password" property="password"></result>
        <result column="birthday" property="birthday"></result>
    </association>
</resultMap>
```

#### 5.1.6 测试

```java
OrderMapper mapper = sqlSession.getMapper(OrderMapper.class);
List<Order> all = mapper.findAll();
for(Order order : all){
    System.out.println(order);
}
```

### 5.2 一对多查询  

#### 5.2.1 一对多查询的模型  

用户表和订单表的关系为，一个用户有多个订单，一个订单只从属于一个用户一对多查询的需求：查询一个用户，与此同时查询出该用户具有的订单  

![image-20230304213120995](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%B8%80%E5%AF%B9%E5%A4%9A%E6%A8%A1%E5%9E%8B.png)



#### 5.2.2 一对多查询的语句  

对应的sql语句：select *,o.id oid from user u left join orders o on u.id=o.uid;  



#### 5.2.3 修改User实体  

```java
public class Order {
    private int id;
    private Date ordertime;
    private double total;
    //代表当前订单从属于哪一个客户
    private User user;
} 
public class User {
    private int id;
    private String username;
    private String password;
    private Date birthday;
    //代表当前用户具备哪些订单
    private List<Order> orderList;
}
```



#### 5.2.4 创建UserMapper接口  

```java
public interface UserMapper {
	List<User> findAll();
}
```

#### 5.2.5 配置UserMapper.xml  

```xml
<maapper namespace="com.lagou.mapper.UserMapper">
    <resultMap id="userMap" type="com.lagou.domain.User">
    <result column="id" property="id"></result>
    <result column="username" property="username"></result>
    <result column="password" property="password"></result>
    <result column="birthday" property="birthday"></result>
    <collection property="orderList" ofType="com.lagou.domain.Order">
        <result column="oid" property="id"></result>
        <result column="ordertime" property="ordertime"></result>
        <result column="total" property="total"></result>
    </collection>
    </resultMap>
    <select id="findAll" resultMap="userMap">
    select *,o.id oid from user u left join orders o on u.id=o.uid
    </select>
</mapper>
```

#### 5.2.6 测试结果  

```java
UserMapper mapper = sqlSession.getMapper(UserMapper.class);
List<User> all = mapper.findAll();
for(User user : all){
    System.out.println(user.getUsername());
    List<Order> orderList = user.getOrderList();
    for(Order order : orderList){
        System.out.println(order);
    } 
System.out.println("----------------------------------");
}
```

### 5.3 多对多查询

#### 5.3.1 多对多查询的模型  

用户表和角色表的关系为，一个用户有多个角色，一个角色被多个用户使用多对多查询的需求：查询用户同时查询出该用户的所有角色  

![image-20230304213508600](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E5%A4%9A%E5%AF%B9%E5%A4%9A%E6%A8%A1%E5%9E%8B.png)

#### 5.3.2 多对多查询的语句  

对应的sql语句：select u.,r.,r.id rid from user u left join user_role ur on u.id=ur.user_id inner join role r on ur.role_id=r.id;  

#### 5.3.3 创建Role实体，修改User实体  

```java
public class User {
    private int id;
    private String username;
    private String password;
    private Date birthday;
    //代表当前用户具备哪些订单
    private List<Order> orderList;
    //代表当前用户具备哪些角色
    private List<Role> roleList;
}
public class Role {
    private int id;
    private String rolename;
}
```

####  5.3.4 添加UserMapper接口方法  

```java
List<User> findAllUserAndRole();
```

#### 5.3.5 配置UserMapper.xml  

```xml
<resultMap id="userRoleMap" type="com.lagou.domain.User">
    <result column="id" property="id"></result>
    <result column="username" property="username"></result>
    <result column="password" property="password"></result>
    <result column="birthday" property="birthday"></result>
    <collection property="roleList" ofType="com.lagou.domain.Role">
        <result column="rid" property="id"></result>
        <result column="rolename" property="rolename"></result>
    </collection>
</resultMap>
<select id="findAllUserAndRole" resultMap="userRoleMap">
	select u.*,r.*,r.id rid from user u left join user_role ur on u.id=ur.user_id inner join role r on ur.role_id=r.id
</select>
```

#### 5.3.6 测试结果  

```java
UserMapper mapper = sqlSession.getMapper(UserMapper.class);
List<User> all = mapper.findAllUserAndRole();
for(User user : all){
    System.out.println(user.getUsername());
    List<Role> roleList = user.getRoleList();
    for(Role role : roleList){
    	System.out.println(role);
    } 
    System.out.println("----------------------------------");
}
```

### 5.4 小结

MyBatis多表配置方式：
**一对一配置：使用做配置
一对多配置：使用+做配置
多对多配置：使用+做配置  **



## 第六部分： Mybatis注解开发

### 6.1 MyBatis的常用注解  

这几年来注解开发越来越流行，Mybatis也可以使用注解开发方式，这样我们就可以减少编写Mapper映射文件了。我们先围绕一些基本的CRUD来学习，再学习复杂映射多表操作。
@Insert：实现新增
@Update：实现更新
@Delete：实现删除
@Select：实现查询
@Result：实现结果集封装
@Results：可以与@Result 一起使用，封装多个结果集
@One：实现一对一结果集封装
@Many：实现一对多结果集封装  

### 6.2 MyBatis的增删改查  

```java
private UserMapper userMapper;
@Before
public void before() throws IOException {
    InputStream resourceAsStream =
    Resources.getResourceAsStream("SqlMapConfig.xml");
    SqlSessionFactory sqlSessionFactory = new
    SqlSessionFactoryBuilder().build(resourceAsStream);
    SqlSession sqlSession = sqlSessionFactory.openSession(true);
    userMapper = sqlSession.getMapper(UserMapper.class);
} 

@Test
public void testAdd() {
    User user = new User();
    user.setUsername("测试数据");
    user.setPassword("123");
    user.setBirthday(new Date());
    userMapper.add(user);
} 
@Test
public void testUpdate() throws IOException {
    User user = new User();
    user.setId(16);
    user.setUsername("测试数据修改");
    user.setPassword("abc");
    user.setBirthday(new Date());
    userMapper.update(user);
}
@Test
public void testDelete() throws IOException {
	userMapper.delete(16);
}
@Test
public void testFindById() throws IOException {
    User user = userMapper.findById(1);
    System.out.println(user);
}
@Test
public void testFindAll() throws IOException {
    List<User> all = userMapper.findAll();
    for(User user : all){
    	System.out.println(user);
    }
}
```

修改MyBatis的核心配置文件，我们使用了注解替代的映射文件，所以我们只需要加载使用了注解的
Mapper接口即可  

```xml
<mappers>
    <!--扫描使用注解的类-->
    <mapper class="com.lagou.mapper.UserMapper"></mapper>
</mappers>
```

或者指定扫描包含映射关系的接口所在的包也可以  

```xml
<mappers>
    <!--扫描使用注解的类所在的包-->
    <package name="com.lagou.mapper"></package>
</mappers>
```

### 6.3 MyBatis的注解实现复杂映射开发  

实现复杂关系映射之前我们可以在映射文件中通过配置来实现，使用注解开发后，我们可以使用@Results注解，@Result注解，@One注解，@Many注解组合完成复杂关系的配置  

| 注解     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| @Results | 代替的标签是<resultMap></resultMap>，该注解中可以单个@Result注解，也可以使用@Result即可，使用格式@Result(@Result(),@Result())或者@Results(@Result()) |
| @Result  | 代替了<id></id>标签和<result></result>标签  @Results属性介绍 column:  数据库列明，property: 需要装配的属性名，one:需要使用@One注解（@Result(one=@One）())) ,many: 需要使用@Many注解(@Result(many=@Many)()) |
| @One     | 代替了<assocation></assocation>标签，是多表查询的关键，在注解中用来指定查询返回的单一对象。@One属性，select:指定用来夺标查询的sqlmapper,使用格式：@Result(column='',property='',one=@One(select=‘’)) |
| @Many    | 代替了<collection></collection>标签，是多表查询的关键，在注解中用来指定子查询的返回的对象集合，使用格式：@Result(property='',column='',many=@Many(select='')) |



### 6.4 一对一查询

模型使用第五部分中的数据

对应的sql如下：

```
select * from orders;
select * from user where id=查询出订单的uid
```

使用注解配置的mapper

```java
public interface OrderMapper {
	@Select("select * from orders")
	@Results({
		@Result(id=true,property="id",column="id")
		@Result(property = "ordertime",column = "ordertime"),
        @Result(property = "total",column = "total"),
        @Result(property = "user",column = "uid",
        javaType = User.class,
        one = @One(select = "com.lagou.mapper.UserMapper.findById"))
	})
	List<Order> findAll();
}

public interface UserMapper{
    @Select("select * from user where id=#id")
    User findById(int id);
}

@Test
public void testSelectOrderAndUser() {
    List<Order> all = orderMapper.findAll();
    for(Order order : all){
    	System.out.println(order);
    }
}
```



### 6.5 一对多查询

用户表和订单表的关系为，一个用户有多个订单，一个订单只从属于一个用户一对多查询的需求：查询一个用户，与此同时查询出该用户具有的订单  

对应的sql语句：  

```sql
select * from user;
select * from orders where uid=查询出用户的id;
```

使用注解的Mapper

```java
public interface UserMapper {
    @Select("select * from user")
    @Results({
        @Result(id = true,property = "id",column = "id"),
        @Result(property = "username",column = "username"),
        @Result(property = "password",column = "password"),
        @Result(property = "birthday",column = "birthday"),
        @Result(property = "orderList",column = "id",javaType = List.class,
        many = @Many(select ="com.lagou.mapper.OrderMapper.findByUid"))
    })
	List<User> findAllUserAndOrder();
} 

public interface OrderMapper {
    @Select("select * from orders where uid=#{uid}")
    List<Order> findByUid(int uid);
}


@Test
public void test(){
    List<User> all = userMapper.findAllUserAndOrder();
    for(User user : all){
    System.out.println(user.getUsername());
    List<Order> orderList = user.getOrderList();
    for(Order order : orderList){
    System.out.println(order);
    } 
    System.out.println("-----------------------------");
}
```



### 6.6 多对多查询  

用户表和角色表的关系为，一个用户有多个角色，一个角色被多个用户使用多对多查询的需求：查询用户同时查询出该用户的所有角色  

对应的sql语句：  

```sql
select * from user;
select * from role r,user_role ur where r.id=ur.role_id and ur.user_id=用户的id
```

使用注解配置Mapper  

```java
public interface UserMapper {
    @Select("select * from user")
    @Results({
        @Result(id = true,property = "id",column = "id"),
        @Result(property = "username",column = "username"),
        @Result(property = "password",column = "password"),
        @Result(property = "birthday",column = "birthday"),
        @Result(property = "roleList",column = "id",
        javaType = List.class,many = @Many(select = "com.lagou.mapper.RoleMapper.findByUid"))
    })
	List<User> findAllUserAndRole();
}

public interface RoleMapper {
    @Select("select * from role r,user_role ur where r.id=ur.role_id and ur.user_id=#{uid}")
    List<Role> findByUid(int uid);
}


@Test
public void test(){
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> all = mapper.findAllUserAndRole();
    for(User user : all){
    System.out.println(user.getUsername());
    List<Role> roleList = user.getRoleList();
    for(Role role : roleList){
    	System.out.println(role);
    }
    System.out.println("----------------------------------");
}
```



## 第七部分： Mybatis缓存

参考地址： https://mybatis.org/mybatis-3/zh/sqlmap-xml.html#cache

### 7.1 一级缓存

#### 7.1.1 一级缓存流程

①、在一个sqlSession中，对User表根据id进行两次查询，查看他们发出sql语句的情况  

```java
@Test
public void test1(){
    //根据 sqlSessionFactory 产生 session
    SqlSession sqlSession = sessionFactory.openSession();
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    //第一次查询，发出sql语句，并将查询出来的结果放进缓存中
    User u1 = userMapper.selectUserByUserId(1);
    System.out.println(u1);
    //第二次查询，由于是同一个sqlSession,会在缓存中查询结果
    //如果有，则直接从缓存中取出来，不和数据库进行交互
    User u2 = userMapper.selectUserByUserId(1);
    System.out.println(u2);
    sqlSession.close();
}
```

控制台打印

![image-20230304220140331](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%B8%80%E7%BA%A7%E7%BC%93%E5%AD%98.png)

② 、同样是对user表进行两次查询，只不过两次查询之间进行了一次update操作。  

```java
@Test
public void test2(){
    //根据 sqlSessionFactory 产生 session
    SqlSession sqlSession = sessionFactory.openSession();
    UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
    //第一次查询，发出sql语句，并将查询的结果放入缓存中
    User u1 = userMapper.selectUserByUserId( 1 );
    System.out.println(u1);
    //第二步进行了一次更新操作，sqlSession.commit()
    u1.setSex("女");
    userMapper.updateUserByUserId(u1);
    sqlSession.commit();
    //第二次查询，由于是同一个sqlSession.commit(),会清空缓存信息
    //则此次查询也会发出sql语句
    User u2 = userMapper.selectUserByUserId(1);
    System.out.println(u2);
    sqlSession.close();
}
```

查看控制台打印情况  

![image-20230304220245373](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%B8%80%E7%BA%A7%E7%BC%93%E5%AD%98commit.png)

③、总结  

1、第一次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，如果没有，从 数据
库查询用户信息。得到用户信息，将用户信息存储到一级缓存中。
2、 如果中间sqlSession去执行commit操作（执行插入、更新、删除），则会清空SqlSession中的 一级
缓存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。
3、 第二次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，缓存中有，直 接从
缓存中获取用户信息  

![image-20230304220335618](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%B8%80%E7%BA%A7%E7%BC%93%E5%AD%98%E6%9F%A5%E8%AF%A2%E6%B5%81%E7%A8%8B.png)

#### 7.1.2 一级缓存原理探究与源码分析

一级缓存到底是什么？一级缓存什么时候被创建、一级缓存的工作流程是怎样的？相信你现在应该会有
这几个疑问，那么我们本节就来研究一下一级缓存的本质大家可以这样想，上面我们一直提到一级缓存，那么提到一级缓存就绕不开SqlSession,所以索性我们 就直接从SqlSession，看看有没有创建缓存或者与缓存有关的属性或者方法  

![image-20230304220457348](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-sqlSession%E6%96%B9%E6%B3%95%E5%9B%BE.png)

调研了一圈，发现上述所有方法中，好像只有clearCache()和缓存沾点关系，那么就直接从这个方 法入
手吧，分析源码时，**我们要看它(此类)是谁，它的父类和子类分别又是谁，对如上关系了解了**，你才会
对这个类有更深的认识，分析了一圈，你可能会得到如下这个流程图  

![image-20230304220615563](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-clearCache%E5%85%B3%E7%B3%BB%E5%9B%BE.png)

再深入分析，流程走到**Perpetualcache**中的clear()方法之后，会调用其cache.clear()方法，那 么这个cache是什么东西呢？点进去发现，cache其实就是**private Map cache = new HashMap()；**也就是一个Map，所以说cache.clear()其实就是map.clear()，也就是说，缓存其实就是本地存放的一个map对象，每一个SqISession都会存放一个map对象的引用，那么这个cache是何时创建，在哪个地方创建。

是Executor，为什么这么认为？因为Executor是执行器，用来执行SQL请求，而且清除缓存的方法也在Executor中执行，所以很可能缓存的创建也很 有可
能在Executor中，看了一圈发现Executor中有一个createCacheKey方法，这个方法很像是创 建缓存的方法啊，跟进去看看，你发现createCacheKey方法是由BaseExecutor执行的，代码如下  

```java
CacheKey cacheKey = new CacheKey();
//MappedStatement 的 id
// id就是Sql语句的所在位置包名+类名+ SQL名称
cacheKey.update(ms.getId());
// offset 就是 0
cacheKey.update(rowBounds.getOffset());
// limit 就是 Integer.MAXVALUE
cacheKey.update(rowBounds.getLimit());
//具体的SQL语句
cacheKey.update(boundSql.getSql());
//后面是update 了 sql中带的参数
cacheKey.update(value);
...
if (configuration.getEnvironment() != null) {
// issue #176
cacheKey.update(configuration.getEnvironment().getId());
}
```

创建缓存key会经过一系列的update方法，udate方法由一个CacheKey这个对象来执行的，这个update方法最终由updateList的list来把五个值存进去，对照上面的代码和下面的图示，你应该能理解这五个值都是什么了

![image-20230304220943663](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-cacheKey%E5%AF%B9%E8%B1%A1.png)



这里需要注意一下最后一个值，configuration.getEnvironment().getId()这是什么，这其实就是定义在mybatis-config.xml中的标签，见如下。  

```xml
<environments default="development">
    <environment id="development">
    <transactionManager type="JDBC"/>
    <dataSource type="POOLED">
    <property name="driver" value="${jdbc.driver}"/>
    <property name="url" value="${jdbc.url}"/>
    <property name="username" value="${jdbc.username}"/>
    <property name="password" value="${jdbc.password}"/>
    </dataSource>
    </environment>
</environments>
```

那么我们回归正题，那么创建完缓存之后该用在何处呢？总不会凭空创建一个缓存不使用吧？绝对不会的，经过我们对一级缓存的探究之后，我们发现一级缓存更多是用于查询操作，毕竟一级缓存也叫做查询缓存吧，为什么叫查询缓存我们一会儿说。我们先来看一下这个缓存到底用在哪了，我们跟踪到query方法如下：  

```java
@Override
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
    BoundSql boundSql = ms.getBoundSql(parameter);
    //创建缓存
    CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
    return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
}

@SuppressWarnings("unchecked")
@Override
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    ...
    list = resultHandler == null ? (List<E>) localCache.getObject(key) : null;
    if (list != null) {
    //这个主要是处理存储过程用的。
    handleLocallyCachedOutputParameters(ms, key, parameter, boundSql);
    } else {
    list = queryFromDatabase(ms, parameter, rowBounds, resultHandler, key,
    boundSql);
    } 
    ...
} 
// queryFromDatabase 方法
private <E> List<E> queryFromDatabase(MappedStatement ms, Object parameter,RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    List<E> list;
    localCache.putObject(key, EXECUTION_PLACEHOLDER);
    try {
    	list = doQuery(ms, parameter, rowBounds, resultHandler, boundSql);
    } finally {
    	localCache.removeObject(key);
    } 
    localCache.putObject(key, list);
    if (ms.getStatementType() == StatementType.CALLABLE) {
    	localOutputParameterCache.putObject(key, parameter);
	}
return list;
}
```

如果查不到的话，就从数据库查，在queryFromDatabase中，会对localcache进行写入。 localcache对象的put方法最终交给Map进行存放  

```java
private Map<Object, Object> cache = new HashMap<Object, Object>();
@Override
public void putObject(Object key, Object value) { cache.put(key, value);
}
```





### 7.2 二级缓存

二级缓存的原理和一级缓存原理一样，第一次查询，会将数据放入缓存中，然后第二次查询则会直接去缓存中取。但是**一级缓存是基于sqlSession的**，而**二级缓存是基于mapper文件的namespace的**，也就是说多个sqlSession可以共享一个mapper中的二级缓存区域，并且如果两个mapper的namespace 相同，即使是两个mapper,那么这两个mapper中执行sql查询到的数据也将存在相同的二级缓存区域中  

![image-20230304221531551](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E4%BA%8C%E7%BA%A7%E7%BC%93%E5%AD%98%E7%A4%BA%E6%84%8F%E5%9B%BE.png)

如何使用二级缓存  

#### ① 、开启二级缓存

和一级缓存默认开启不一样，**二级缓存需要我们手动开启**
首先在全局配置文件sqlMapConfig.xml文件中加入如下代码:  

```xml
<!--开启二级缓存-->
<settings>
	〈setting name="cacheEnabled" value="true"/>
</settings〉
```

其次在UserMapper.xml文件中开启缓存  

```xml
<!--开启二级缓存-->
<cache></cache>
```

我们可以看到mapper.xml文件中就这么一个空标签，其实这里可以配置,PerpetualCache这个类是mybatis默认实现缓存功能的类。我们不写type就使用mybatis默认的缓存，也可以去实现Cache接口来自定义缓存。  

![image-20230304221718091](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E8%87%AA%E5%AE%9A%E4%B9%89%E4%BA%8C%E7%BA%A7%E7%BC%93%E5%AD%98%E7%B1%BB%E5%9B%BE.png)

```java
public class PerpetualCache implements Cache {
    private final String id;
    private MapcObject, Object> cache = new HashMapC);
    public PerpetualCache(St ring id) {
    	this.id = id;
}
```

我们可以看到二级缓存底层还是HashMap结构  

```java
public class User implements Serializable(
    //用户ID
    private int id;
    //用户姓名
    private String username;
    //用户性别
    private String sex;
}
```

**开启了二级缓存后，还需要将要缓存的pojo实现Serializable接口**，为了将缓存数据取出执行反序列化操作，因为二级缓存数据存储介质多种多样，不一定只存在内存中，有可能存在硬盘中，如果我们要再取这个缓存的话，就需要反序列化了。所以mybatis中的pojo都去实现Serializable接口  

####  ③、测试

一、测试二级缓存和sqlSession无关  

```java
@Test
public void testTwoCache(){
    //根据 sqlSessionFactory 产生 session
    SqlSession sqlSession1 = sessionFactory.openSession();
    SqlSession sqlSession2 = sessionFactory.openSession();
    UserMapper userMapper1 = sqlSession1.getMapper(UserMapper.class );
    UserMapper userMapper2 = sqlSession2.getMapper(UserMapper.class );
    //第一次查询，发出sql语句，并将查询的结果放入缓存中
    User u1 = userMapper1.selectUserByUserId(1);
    System.out.println(u1);
    sqlSession1.close(); 
    //第一次查询完后关闭 sqlSession
    //第二次查询，即使sqlSession1已经关闭了，这次查询依然不发出sql语句
    User u2 = userMapper2.selectUserByUserId(1);
    System.out.println(u2);
    sqlSession2.close();
```

**结论：可以看出上面两个不同的sqlSession,第一个关闭了，第二次查询依然不发出sql查询语句  **



二、测试执行commit()操作，二级缓存数据清空  

```java
@Test
public void testTwoCache(){
    //根据 sqlSessionFactory 产生 session
    SqlSession sqlSession1 = sessionFactory.openSession();
    SqlSession sqlSession2 = sessionFactory.openSession();
    SqlSession sqlSession3 = sessionFactory.openSession();
    String statement = "com.lagou.pojo.UserMapper.selectUserByUserld" ;
    UserMapper userMapper1 = sqlSession1.getMapper(UserMapper. class );
    UserMapper userMapper2 = sqlSession2.getMapper(UserMapper. class );
    UserMapper userMapper3 = sqlSession2.getMapper(UserMapper. class );
    //第一次查询，发出sql语句，并将查询的结果放入缓存中
    User u1 = userMapperl.selectUserByUserId( 1 );
    System.out.println(u1);
    sqlSessionl .close(); //第一次查询完后关闭sqlSession
    //执行更新操作，commit()
    u1.setUsername( "aaa" );
    userMapper3.updateUserByUserId(u1);
    sqlSession3.commit();
    //第二次查询，由于上次更新操作，缓存数据已经清空(防止数据脏读)，这里必须再次发出sql语
    User u2 = userMapper2.selectUserByUserId( 1 );
    System.out.println(u2);
    sqlSession2.close();
}
```

查看控制台情况：  

![image-20230304222133744](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E6%B5%8B%E8%AF%95%E4%BA%8C%E7%BA%A7%E7%BC%93%E5%AD%98.png)



#### ④、useCache和flushCache  

mybatis中还可以配置userCache和flushCache等配置项，**userCache是用来设置是否禁用二级缓存的**，在statement中设置useCache=false可以禁用当前select语句的二级缓存，即每次查询都会发出 ql去查询，**默认情况是true,即该sql使用二级缓存 **

```xml
<select id="selectUserByUserId" useCache="false" resultType="com.lagou.pojo.User" parameterType="int">
	select * from user where id=#{id}
</select>
```

这种情况是针对每次查询都需要最新的数据sql,要设置成useCache=false，禁用二级缓存，直接从数据库中获取。在mapper的同一个namespace中，如果有其它insert、update, delete操作数据后需要刷新缓存，**如果不执行刷新缓存会出现脏读**。
设置statement配置中的flushCache="true”属性，默认情况下为true,即刷新缓存，如果改成false则不会刷新。使用缓存时如果手动修改数据库表中的查询数据会出现脏读。  

 

```xml
<select id="selectUserByUserId" flushCache="true" useCache="false" resultType="com.lagou.pojo.User" parameterType="int">
	select * from user where id=#{id}
</select>
```

**一般下执行完commit操作都需要刷新缓存，flushCache=true表示刷新缓存，这样可以避免数据库脏读。所以我们不用设置，默认即可  **

### 7.3 二级缓存整合Redis缓存

#### 7.3.1 配置redis作为二级缓存服务器

mybatis自带的二级缓存是一个单节点缓存，使用redis做一个分布式集群缓存

![image-20230305134649855](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E5%88%86%E5%B8%83%E5%BC%8Fredis.png)

实现：mybatis提供了一个eache接口，如果要实现自己的缓存逻辑，实现cache接口开发即可。mybatis本身默认实现了一个，但是这个缓存的实现无法实现分布缓存，所以我们要自己来实现。redis分布式缓存就可以，mybatis提供了一个针对cache接口的redis实现类，该类存在mybatis-redis包中 

1. 引入依赖

```xml
<dependency>
    <groupId>org.mybatis.caches</groupId>
    <artifactId>mybatis-redis</artifactId>
    <version>1.0.0-beta2</version>
</dependency>
```

2. 修改mapper.xml

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
   "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
   <mapper namespace="com.lagou.mapper.IUserMapper">
   	<!-- redis-->
       <cache type="org.mybatis.caches.redis.RedisCache" />
       <select id="findAll" resultType="com.lagou.pojo.User" useCache="true">
   		select * from user
   </select>
   ```

3.  配置redis

```properties
redis.host=localhost
redis.port=6379
redis.connectionTimeout=5000
redis.password=
redis.database=0
```

4. 测试

   ```java
   @Test
   public void SecondLevelCache(){
       SqlSession sqlSession1 = sqlSessionFactory.openSession();
       SqlSession sqlSession2 = sqlSessionFactory.openSession();
       SqlSession sqlSession3 = sqlSessionFactory.openSession();
       IUserMapper mapper1 = sqlSession1.getMapper(IUserMapper.class);
       lUserMapper mapper2 = sqlSession2.getMapper(lUserMapper.class);
       lUserMapper mapper3 = sqlSession3.getMapper(IUserMapper.class);
       User user1 = mapper1.findUserById(1);
       sqlSession1.close(); //清空一级缓存
       User user = new User();
       user.setId(1);
       user.setUsername("lisi");
       mapper3.updateUser(user);
       sqlSession3.commit();
       User user2 = mapper2.findUserById(1);
       System.out.println(user1==user2);
   }
   ```

#### 7.3.2 源码分析

RedisCache和大家普遍实现Mybatis的缓存方案大同小异，无非是实现Cache接口，并使用jedis操作缓存；不过该项目在设计细节上有一些区别；  

```java
public final class RedisCache implements Cache {
    public RedisCache(final String id) {
        if (id == null) {
            throw new IllegalArgumentException("Cache instances require anID");
        }
        this.id = id;
        RedisConfig redisConfig = RedisConfigurationBuilder.getInstance().parseConfiguration();
        pool = new JedisPool(redisConfig, redisConfig.getHost(),
        redisConfig.getPort(),
        redisConfig.getConnectionTimeout(),
        redisConfig.getSoTimeout(), redisConfig.getPassword(),
        redisConfig.getDatabase(), redisConfig.getClientName());
    }
}
```

RedisCache在mybatis启动的时候，由MyBatis的CacheBuilder创建，创建的方式很简单，就是调用RedisCache的带有String参数的构造方法，即RedisCache(String id)；而在RedisCache的构造方法中，调用了 RedisConfigurationBuilder 来创建 RedisConfig 对象，并使用 RedisConfig 来创建JedisPool。
RedisConfig类继承了 JedisPoolConfig，并提供了 host,port等属性的包装，简单看一下RedisConfig的属性：  

```java
public class RedisConfig extends JedisPoolConfig {
    private String host = Protocol.DEFAULT_HOST;
    private int port = Protocol.DEFAULT_PORT;
    private int connectionTimeout = Protocol.DEFAULT_TIMEOUT;
    private int soTimeout = Protocol.DEFAULT_TIMEOUT;
    private String password;
    private int database = Protocol.DEFAULT_DATABASE;
    private String clientName;
```

RedisConfig对象是由RedisConfigurationBuilder创建的，简单看下这个类的主要方法：  

```java
public RedisConfig parseConfiguration(ClassLoader classLoader) {
    Properties config = new Properties();
    InputStream input =
    classLoader.getResourceAsStream(redisPropertiesFilename);
    if (input != null) {
        try {
        	config.load(input);
        } catch (IOException e) {
        	throw new RuntimeException("An error occurred while reading classpath property '"+ redisPropertiesFilename + "', see nested exceptions", e);
        } finally {
            try {
            	input.close();
            } catch (IOException e) {
            	// close quietly
            }
		}
	}
    RedisConfig jedisConfig = new RedisConfig();
    setConfigProperties(config, jedisConfig);
    return jedisConfig;
}
```

核心的方法就是parseConfiguration方法，该方法从classpath中读取一个redis.properties文件:  

```properties
host=localhost
port=6379
connectionTimeout=5000
soTimeout=5000
password= database=0 clientName=
```

并将该配置文件中的内容设置到RedisConfig对象中，并返回；接下来，就是RedisCache使用RedisConfig类创建完成edisPool；在RedisCache中实现了一个简单的模板方法，用来操作Redis：  

```java
private Object execute(RedisCallback callback) {
    Jedis jedis = pool.getResource();
    try {
    	return callback.doWithRedis(jedis);
    } finally {
   		 jedis.close();
    }
}
```

模板接口为RedisCallback，这个接口中就只需要实现了一个doWithRedis方法而已：  

```java
public interface RedisCallback {
	Object doWithRedis(Jedis jedis);
}
```

接下来看看Cache中最重要的两个方法：putObject和getObject，通过这两个方法来查看mybatis-redis储存数据的格式：  

```java
@Override
public void putObject(final Object key, final Object value) {
	execute(new RedisCallback() {
        @Override
        public Object doWithRedis(Jedis jedis) {
            jedis.hset(id.toString().getBytes(), key.toString().getBytes(),
            SerializeUtil.serialize(value));
            return null;
        }
  });
}

@Override
public Object getObject(final Object key) {
	return execute(new RedisCallback() {
    @Override
    public Object doWithRedis(Jedis jedis) {
    	return SerializeUtil.unserialize(jedis.hget(id.toString().getBytes(), key.toString().getBytes()));
    } 
    });
}
```

可以很清楚的看到，mybatis-redis在存储数据的时候，是使用的hash结构，把cache的id作为这个hash的key (cache的id在mybatis中就是mapper的namespace)；这个mapper中的查询缓存数据作为 hash的field,需要缓存的内容直接使用SerializeUtil存储，SerializeUtil和其他的序列化类差不多，负责对象的
序列化和反序列化；  



## 第八部分： Mybatis插件

参考地址： https://mybatis.org/mybatis-3/zh/configuration.html#plugins

### 8.1 插件介绍

一般情况下，开源框架都会提供插件或其他形式的拓展点，供开发者自行拓展。这样的好处是显而易见的，一是增加了框架的灵活性。二是开发者可以结合实际需求，对框架进行拓展，使其能够更好的工作。以MyBatis为例，我们可基于MyBati s插件机制实现分页、分表，监控等功能。由于插件和业务无关，业务也无法感知插件的存在。因此可以无感植入插件，在无形中增强功能  

### 8.2 Mybatis插件介绍

Mybatis作为一个应用广泛的优秀的ORM开源框架，这个框架具有强大的灵活性，**在四大组件(Executor、StatementHandler、ParameterHandler、ResultSetHandler)**处提供了简单易用的插件扩展机制。Mybatis对持久层的操作就是借助于四大核心对象。MyBatis支持用插件对四大核心对象进行拦截，**对mybatis来说插件就是拦截器，用来增强核心对象的功能**，增强功能本质上是借助于底层的 动态代理实现的，换句话说，MyBatis中的四大对象都是代理对象 。

![image-20230305140205460](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E5%9B%9B%E5%A4%A7%E7%BB%84%E4%BB%B6.png)

**MyBatis所允许拦截的方法如下：**

- 执行器Executor (update、query、commit、rollback等方法)；
- SQL语法构建器StatementHandler (prepare、parameterize、batch、updates query等方法)；
- 参数处理器ParameterHandler (getParameterObject、setParameters方法)；
- 结果集处理器ResultSetHandler (handleResultSets、handleOutputParameters等方法)；  

### 8.3 Mybatis插件原理  

在四大对象创建的时候
1、每个创建出来的对象不是直接返回的，而是interceptorChain.pluginAll(parameterHandler);
2、获取到所有的Interceptor (拦截器)(插件需要实现的接口)；调用 interceptor.plugin(target);返回 target包装后的对象
3、插件机制，我们可以使用插件为目标对象创建一个代理对象；AOP (面向切面)我们的插件可以为四大对象创建出代理对象，代理对象就可以拦截到四大对象的每一个执行；  

**拦截**

插件具体是如何拦截并附加额外的功能的呢？以ParameterHandler来说  

```java
public ParameterHandler newParameterHandler(MappedStatement mappedStatement,Object object, BoundSql sql, InterceptorChain interceptorChain){
    ParameterHandler parameterHandler = mappedStatement.getLang().createParameterHandler(mappedStatement,object,sql);
    parameterHandler = (ParameterHandler)
    interceptorChain.pluginAll(parameterHandler);
    return parameterHandler;
}
public Object pluginAll(Object target) {
   for (Interceptor interceptor : interceptors) {
       target = interceptor.plugin(target);
    } 
   return target;
}
```

interceptorChain保存了所有的拦截器(interceptors)，是mybatis初始化的时候创建的。调用拦截器链中的拦截器依次的对目标进行拦截或增强。interceptor.plugin(target)中的target就可以理解为mybatis中的四大对象。返回的target是被重重代理后的对象如果我们想要拦截Executor的query方法，那么可以这样定义插件：  

```java
@Intercepts({
    @Signature(
        type = Executor.class,
        method = "query",
        args={MappedStatement.class,Object.class,RowBounds.class,ResultHandler.class}
	)
})
public class ExeunplePlugin implements Interceptor {
//省略逻辑
}
```

除此之外，我们还需将插件配置到sqlMapConfig.xm l中。  

```xml
<plugins>
    <plugin interceptor="com.lagou.plugin.ExamplePlugin">
    </plugin>
</plugins>
```

这样MyBatis在启动时可以加载插件，并保存插件实例到相关对象(InterceptorChain，拦截器链) 中。待准备工作做完后，MyBatis处于就绪状态。我们在执行SQL时，需要先通过DefaultSqlSessionFactory 创建 SqlSession。Executor 实例会在创建 SqlSession 的过程中被创建， Executor实例创建完毕后，MyBatis会通过JDK动态代理为实例生成代理类。这样，插件逻辑即可在 Executor相关方法被调用前执行。
以上就是MyBatis插件机制的基本原理  

### 8.4 自定义插件  

#### 8.4.1 插件接口

Mybatis 插件接口-Interceptor
• Intercept方法，插件的核心方法
• plugin方法，生成target的代理对象
• setProperties方法，传递插件所需参数  

#### 8.4.2自定义插件  

设计实现一个自定义插件  

```java
Intercepts ({//注意看这个大花括号，也就这说这里可以定义多个@Signature对多个地方拦截，都用这个拦截器
@Signature (type = StatementHandler.class , //这是指拦截哪个接口
method = "prepare"，//这个接口内的哪个方法名，不要拼错了
args = { Connection.class, Integer.class}),// 这是拦截的方法的入参，按顺序写到这，不要多也不要少，如果方法重载，可是要通过方法名和入参来确定唯一的
})
public class MyPlugin implements Interceptor {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    //这里是每次执行操作的时候，都会进行这个拦截器的方法内
    Override
    public Object intercept(Invocation invocation) throws Throwable {
    //增强逻辑
    System.out.println("对方法进行了增强....")；
    return invocation.proceed(); //执行原方法
    }
/**
* 主要是为了把这个拦截器生成一个代理放到拦截器链中
* ^Description包装目标对象 为目标对象创建代理对象
* @Param target为要拦截的对象
* @Return代理对象
*/
@Override
public Object plugin(Object target) {
    System.out.println("将要包装的目标对象："+target);
    return Plugin.wrap(target,this);
} 
/**获取配置文件的属性**/
//插件初始化的时候调用，也只调用一次，插件配置的属性从这里设置进来
@Override
public void setProperties(Properties properties) {
	System.out.println("插件配置的初始化参数："+properties );
	}
}
```

sqlMapConfig.xml  

```xml
<plugins>
    <plugin interceptor="com.lagou.plugin.MySqlPagingPlugin">
        <!--配置参数-->
        <property name="name" value="Bob"/>
    </plugin>
</plugins>
```

mapper接口  

```java
public interface UserMapper {
	List<User> selectUser();
}
```

mapper.xml

```xml
<mapper namespace="com.lagou.mapper.UserMapper">
    <select id="selectUser" resultType="com.lagou.pojo.User">
    	SELECT id,username FROM user
    </select>
</mapper>
```

测试

```java
public class PluginTest {
    @Test
    public void test() throws IOException {
        InputStream resourceAsStream =
        Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory sqlSessionFactory = new
        SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = sqlSessionFactory.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        List<User> byPaging = userMapper.selectUser();
        for (User user : byPaging) {
        	System.out.println(user);
    	}
	}
}
```

### 8.5 源码分析  

执行插件逻辑
Plugin实现了 InvocationHandler接口，因此它的invoke方法会拦截所有的方法调用。invoke方法会对所拦截的方法进行检测，以决定是否执行插件逻辑。该方法的逻辑如下： 

```java
// -Plugin
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    try {
    /*
    *获取被拦截方法列表，比如：
    * signatureMap.get(Executor.class), 可能返回 [query, update, commit]
    */
    Set<Method> methods = signatureMap.get(method.getDeclaringClass());
    //检测方法列表是否包含被拦截的方法
    if (methods != null && methods.contains(method)) {
        //执行插件逻辑
        return interceptor.intercept(new Invocation(target, method, args));
        //执行被拦截的方法
        return method.invoke(target, args);
    	} catch(Exception e){
        
    }
}
```

invoke方法的代码比较少，逻辑不难理解。首先,invoke方法会检测被拦截方法是否配置在插件的@Signature注解中，若是，则执行插件逻辑，否则执行被拦截方法。插件逻辑封装在intercept中，该方法的参数类型为Invocationo Invocation主要用于存储目标类，方法以及方法参数列表。下面简单看一下该类的定义 

```java
public class Invocation {
private final Object target;
private final Method method;
private final Object[] args;
public Invocation(Object targetf Method method, Object[] args) {
this.target = target;
this.method = method;
//省略部分代码
public Object proceed() throws InvocationTargetException, IllegalAccessException
{ //调用被拦截的方法
>> —
```

### 8.6 pageHelper分页插件  

MyBati s可以使用第三方的插件来对功能进行扩展，分页助手PageHelper是将分页的复杂操作进行封
装，使用简单的方式即可获得分页的相关数据
开发步骤：
① 导入通用PageHelper的坐标
② 在mybatis核心配置文件中配置PageHelper插件
③ 测试分页数据获取

**①导入通用PageHelper依赖**

```xml
<dependency>
    <groupId>com.github.pagehelper</groupId>
    <artifactId>pagehelper</artifactId>
    <version>3.7.5</version>
</dependency>
<dependency>
    <groupId>com.github.jsqlparser</groupId>
    <artifactId>jsqlparser</artifactId>
    <version>0.9.1</version>
</dependency>
```

**② 在mybatis核心配置文件中配置PageHelper插件  **

```xml
<!--注意：分页助手的插件 配置在通用馆mapper之前*-->*
<plugin interceptor="com.github.pagehelper.PageHelper">
    <!—指定方言 —>
    <property name="dialect" value="mysql"/>
</plugin>
```

**③ 测试分页代码实现  **

```java
@Test
public void testPageHelper() {
    //设置分页参数
    PageHelper.startPage(1, 2);
    List<User> select = userMapper2.select(null);
    for (User user : select) {
    	System.out.println(user);
    }
}
```

获得分页相关的其他参数  

```java
//其他分页的数据
PageInfo<User> pageInfo = new PageInfo<User>(select);
System.out.println("总条数："+pageInfo.getTotal());
System.out.println("总页数："+pageInfo. getPages ());
System.out.println("当前页："+pageInfo. getPageNum());
System.out.println("每页显万长度："+pageInfo.getPageSize());
System.out.println("是否第一页："+pageInfo.isIsFirstPage());
System.out.println("是否最后一页："+pageInfo.isIsLastPage());  
```

### 8.7 通用 mapper  

什么是通用Mapper？
通用Mapper就是为了解决单表增删改查，基于Mybatis的插件机制。开发人员不需要编写SQL,不需要在DAO中增加方法，只要写好实体类，就能支持相应的增删改查方法。

1. 添加依赖

   ```xml
   <dependency>
       <groupId>tk.mybatis</groupId>
       <artifactId>mapper</artifactId>
       <version>3.1.2</version>
   </dependency>
   ```

2. mybatis配置文件添加配置信息

```xml
<plugins>
    <!--分页插件：如果有分页插件，要排在通用mapper之前-->
    <plugin interceptor="com.github.pagehelper.PageHelper">
        <property name="dialect" value="mysql"/>
    </plugin>
    <plugin interceptor="tk.mybatis.mapper.mapperhelper.MapperInterceptor">
        <!-- 通用Mapper接口，多个通用接口用逗号隔开 -->
        <property name="mappers" value="tk.mybatis.mapper.common.Mapper"/>
    </plugin>
</plugins>
```

3. 实体类设置主键  

   ```java
   @Table(name = "t_user")
   public class User {
       @Id
       @GeneratedValue(strategy = GenerationType.IDENTITY)
       private Integer id;
       private String username;
   }
   ```

4. 定义通用mapper  

   ```java
   import tk.mybatis.mapper.common.Mapper;
   public interface UserMapper extends Mapper<User> {
   }
   ```

5. 测试

```java
public class UserTest {
    @Test
    public void test1() throws IOException {
        Inputstream resourceAsStream =
        Resources.getResourceAsStream("sqlMapConfig.xml");
        SqlSessionFactory build = new
        SqlSessionFactoryBuilder().build(resourceAsStream);
        SqlSession sqlSession = build.openSession();
        UserMapper userMapper = sqlSession.getMapper(UserMapper.class);
        User user = new User();
        user.setId(4);
        //(1)mapper基础接口
        //select 接口
        User user1 = userMapper.selectOne(user); //根据实体中的属性进行查询，只能有 —个返回值
        List<User> users = userMapper.select(null); //查询全部结果
        userMapper.selectByPrimaryKey(1); //根据主键字段进行查询，方法参数必须包含完 整的主键属性，查询条件使用等号
        userMapper.selectCount(user); //根据实体中的属性查询总数，查询条件使用等号
        // insert 接口
        int insert = userMapper.insert(user); //保存一个实体，null值也会保存，不会使用数据库默认值
        int i = userMapper.insertSelective(user); //保存实体，null的属性不会保存， 会使用数据库默认值
        // update 接口
        int i1 = userMapper.updateByPrimaryKey(user);//根据主键更新实体全部字段，null值会被更新
        // delete 接口
        int delete = userMapper.delete(user); //根据实体属性作为条件进行删除，查询条件使用等号
        userMapper.deleteByPrimaryKey(1); //根据主键字段进行删除，方法参数必须包含完 整的主键属性
        //(2)example方法
        Example example = new Example(User.class);
        example.createCriteria().andEqualTo("id", 1);
        example.createCriteria().andLike("val", "1");
        //自定义查询
        List<User> users1 = userMapper.selectByExample(example);
    }
}
```



## 第九部分: Mybatis框架原理

### 9.1架构设计

![image-20230305142533442](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E6%A1%86%E6%9E%B6%E5%8E%9F%E7%90%86%E5%9B%BE.png)

我们把Mybatis的功能架构分为三层：
	(1) API接口层：提供给外部使用的接口 API，开发人员通过这些本地API来操纵数据库。接口层一接收到调用请求就会调用数据处理层来完成具体的数据处理。
		MyBatis和数据库的交互有两种方式：
			a. 使用传统的MyBati s提供的API ；
			b. 使用Mapper代理的方式
	(2) 数据处理层：负责具体的SQL查找、SQL解析、SQL执行和执行结果映射处理等。它主要的目的是根据调用的请求完成一次数据库操作。
	(3) 基础支撑层：负责最基础的功能支撑，包括连接管理、事务管理、配置加载和缓存处理，这些都是共用的东西，将他们抽取出来作为最基础的组件。为上层的数据处理层提供最基础的支撑  

### 9.2主要构件及其相互关系  

| 构件             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| SqlSession       | 作为MyBatis工作的主要顶层API，表示和数据库交互的会话，完成必要数据库增删改查功能 |
| Executor         | MyBatis执行器，是MyBatis调度的核心，负责SQL语句的生成和查询缓存的维护 |
| StatementHandler | 封装了JDBC Statement操作，负责对JDBC statement的操作，如设置参数、将Statement结果集转换成List集合。 |
| ParameterHandler | 负责对用户传递的参数转换成JDBC Statement所需要的参数，       |
| ResultSetHandler | 负责将JDBC返回的ResultSet结果集对象转换成List类型的集合；    |
| TypeHandler      | 负责java数据类型和jdbc数据类型之间的映射和转换               |
| MappedStatement  | MappedStatement维护了一条＜select \| update \| delete \| insert＞节点 的封 装 |
| SqlSource        | 负责根据用户传递的parameterObject，动态地生成SQL语句，将信息封装到BoundSql对象中，并返回 |
| BoundSql         | 表示动态生成的SQL语句以及相应的参数信息                      |

![image-20230305142822629](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E7%BB%93%E6%9E%84%E5%9B%BE.png)

### 9.3总体流程  

(1) 加载配置并初始化
触发条件：加载配置文件
配置来源于两个地方，一个是配置文件(主配置文件conf.xml,mapper文件*.xml),—个是java代码中的注解，将主配置文件内容解析封装到Configuration,将sql的配置信息加载成为一个mappedstatement 对象，存储在内存之中

(2) 接收调用请求
触发条件：调用Mybatis提供的API
传入参数：为SQL的ID和传入参数对象
处理过程：将请求传递给下层的请求处理层进行处理。

(3) 处理操作请求
触发条件：API接口层传递请求过来
传入参数：为SQL的ID和传入参数对象
处理过程：
	(A) 根据SQL的ID查找对应的MappedStatement对象。
	(B) 根据传入参数对象解析MappedStatement对象，得到最终要执行的SQL和执行传入参数。
	(C) 获取数据库连接，根据得到的最终SQL语句和执行传入参数到数据库执行，并得到执行结果。
	(D) 根据MappedStatement对象中的结果映射配置对得到的执行结果进行转换处理，并得到最终的处理结果。
	(E) 释放连接资源。

(4) 返回处理结果
将最终的处理结果返回。  

## 第十部分： Mybatis源码剖析

### 10.1传统方式源码剖析

#### 初始化

```java
Inputstream inputstream = Resources.getResourceAsStream("mybatisconfig.xml");
//这一行代码正是初始化工作的开始。
SqlSessionFactory factory = new
SqlSessionFactoryBuilder().build(inputStream);
```

进入源码

```java
// 1.我们最初调用的build
public SqlSessionFactory build (InputStream inputStream){
    //调用了重载方法
    return build(inputStream, null, null);
} 
// 2.调用的重载方法
public SqlSessionFactory build (InputStream inputStream, String environment, Properties properties){
    try {
        // XMLConfigBuilder是专门解析mybatis的配置文件的类
        XMLConfigBuilder parser = new XMLConfigBuilder(inputstream,
        environment, properties);
        //这里又调用了一个重载方法。parser.parse()的返回值是Configuration对象
        return build(parser.parse());
    } catch (Exception e) {
    	throw ExceptionFactory.wrapException("Error buildingSqlSession.", e)
	}
}
```

MyBatis在初始化的时候，会将MyBatis的配置信息全部加载到内存中，使用org.apache.ibatis.session.Configuratio n 实例来维护  



下面进入对配置文件解析部分：

1. Configuration对象

   Configuration对象的结构和xml配置文件的对象几乎相同  

   回顾一下xml中的配置标签有哪些：  

   > properties (属性)，settings (设置)，typeAliases (类型别名)，typeHandlers (类型处理器)，objectFactory (对象工厂)，mappers (映射器)等 Configuration也有对应的对象属性来封装它们

也就是说，初始化配置文件信息的本质就是创建Configuration对象，将解析的xml数据封装到Configuration内部属性中

```java
/**
* 解析 XML 成 Configuration 对象。
*/
public Configuration parse () {
//若已解析，抛出BuilderException异常
if (parsed) {
	throw new BuilderException("Each XMLConfigBuilder can only be used once.");
} 
//标记已解析
parsed = true;
// 解析 XML configuration 节点
parseConfiguration(parser.evalNode("/configuration"));
	return configuration;
}
/**
*解析XML
*/
private void parseConfiguration (XNode root){
    try {
        //issue #117 read properties first
        // 解析 <properties /> 标签
        propertiesElement(root.evalNode("properties"));
        // 解析〈settings /> 标签
        Properties settings =
        settingsAsProperties(root.evalNode("settings"));
        //加载自定义的VFS实现类
        loadCustomVfs(settings);
        // 解析 <typeAliases /> 标签
        typeAliasesElement(root.evalNode("typeAliases"));
        //解析<plugins />标签
        pluginElement(root.evalNode("plugins"));
        // 解析 <objectFactory /> 标签
        objectFactoryElement(root.evalNode("objectFactory"));
        // 解析 <objectWrapperFactory /> 标签
        objectWrapperFactoryElement(root.evalNode("objectWrapperFactory"));
        // 解析 <reflectorFactory /> 标签
        reflectorFactoryElement(root.evalNode("reflectorFactory"));
        // 赋值 <settings /> 至 Configuration 属性
        settingsElement(settings);
        // read it after objectFactory and objectWrapperFactory issue #631
        // 解析〈environments /> 标签
        environmentsElement(root.evalNode("environments"));
        // 解析 <databaseIdProvider /> 标签
        databaseldProviderElement(root.evalNode("databaseldProvider"));
        // 解析 <typeHandlers /> 标签
        typeHandlerElement(root.evalNode("typeHandlers"));
        //解析<mappers />标签
        mapperElement(root.evalNode("mappers"));
        } catch (Exception e) {
        	throw new BuilderException("Error parsing SQL Mapper Configuration.Cause:" + e, e);
        }
}
```

2. MappedStatement   

   MappedStatement与Mapper配置文件中的一个select/update/insert/delete节点相对应。mapper中配置的标签都被封装到了此对象中，主要用途是描述一条SQL语句 

 在加载配置文件的时候，会对mybatis-config.xml中各个标签进行解析，其中mappers标签就是用来引入mapper.xml配置文件或者mapper接口信息。

将配置的类似**select,update,delete**等封装成一个MappedStatement对象，然后存储到Cinfiguration对象的mappedStatements属性中，mappedStatements 是一个HashMap，存储时key=全限定类名+方法名，value =对应的MappedStatement对象。  

```java
Map<String, MappedStatement> mappedStatements = new StrictMap<MappedStatement>
("Mapped Statements collection")
```

在 XMLConfigBuilder 中的处理

```java
private void parseConfiguration(XNode root) {
    try {
        //省略其他标签的处理
        mapperElement(root.evalNode("mappers"));
    } catch (Exception e) {
    	throw new BuilderException("Error parsing SQL Mapper Configuration. Cause:" + e, e);
    }
}
```

到此对xml配置文件的解析就结束了，回到步骤2.中调用的重载build方法  

```java
// 5.调用的重载方法
public SqlSessionFactory build(Configuration config) {
    //创建了 DefaultSqlSessionFactory 对象，传入 Configuration 对象。
    return new DefaultSqlSessionFactory(config);
}
```



#### 执行SQL流程

##### SqlSession

 SqlSession是一个接口，有两个实现类：DefaultSqlSession(默认) 和 SqlSessionManager(已经弃用)

SqlSession是MyBatis中用于和数据库交互的顶层类，通常将它与ThreadLocal绑定，一个会话使用一 个
SqlSession,并且在使用完毕后需要close  

```java
public class DefaultSqlSession implements SqlSession {
	private final Configuration configuration;
	private final Executor executor;
}
```

SqlSession中的两个最重要的参数，configuration与初始化时的相同，Executor为执行器  

##### Execuror

Executor也是一个接口，他有三个常用的实现类：
BatchExecutor (重用语句并执行批量更新)
ReuseExecutor (重用预处理语句 prepared statements)
SimpleExecutor (普通的执行器，默认)
继续分析，初始化完毕后，我们就要执行SQL 了  

```java
SqlSession sqlSession = factory.openSession();
List<User> list =
sqlSession.selectList("com.lagou.mapper.UserMapper.getUserByName");
```

获得SqlSession

```java
//6. 进入 o penSession 方法。
public SqlSession openSession() {
    //getDefaultExecutorType()传递的是SimpleExecutor
    return openSessionFromDataSource(configuration.getDefaultExecutorType(),null, false);
}
//7. 进入penSessionFromDataSource。
//ExecutorType 为Executor的类型，TransactionIsolationLevel为事务隔离级别，autoCommit是否开启事务
//openSession的多个重载方法可以指定获得的SeqSession的Executor类型和事务的处理
private SqlSession openSessionFromDataSource(ExecutorType execType,TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try{
        final Environment environment = configuration.getEnvironment();
        final TransactionFactory transactionFactory =
        getTransactionFactoryFromEnvironment(environment);
        tx = transactionFactory.newTransaction(environment.getDataSource(),
        level, autoCommit);
        //根据参数创建指定类型的Executor
        final Executor executor = configuration.newExecutor(tx, execType);
        //返回的是 DefaultSqlSession
        return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch(Exception e){
        closeTransaction(tx); // may have fetched a connection so lets call
        close()
    }
}
```

执行 sqlsession 中的 api  

```java
//8.进入selectList方法，多个重载方法。
public <E > List < E > selectList(String statement) {
    return this.selectList(statement, null);
    public <E > List < E > selectList(String statement, Object parameter) {
    return this.selectList(statement, parameter, RowBounds.DEFAULT);
    public <E > List < E > selectList(String statement, Object parameter, RowBounds rowBounds) {
    try {
        //根据传入的全限定名+方法名从映射的Map中取出MappedStatement对象
        MappedStatement ms =
        configuration.getMappedStatement(statement);
        //调用Executor中的方法处理
        //RowBounds是用来逻辑分页
        // wrapCollection(parameter)是用来装饰集合或者数组参数
        return executor.query(ms, wrapCollection(parameter),
        rowBounds, Executor.NO_RESULT_HANDLER);
        } catch (Exception e) {
            throw ExceptionFactory.wrapException("Error querying
            database. Cause: + e, e);
    } finally {
   		 ErrorContext.instance().reset();
    }
}
```



#### Executor

继续源码中的步骤，进入executor.query()  

```java
//此方法在SimpleExecutor的父类BaseExecutor中实现
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds  rowBounds, ResultHandler resultHandler) throws SQLException {
    //根据传入的参数动态获得SQL语句，最后返回用BoundSql对象表示
    BoundSql boundSql = ms.getBoundSql(parameter);
    //为本次查询创建缓存的Key
    CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
    return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
    } 
//进入query的重载方法中
public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    ErrorContext.instance().resource(ms.getResource()).activity("executing aquery").object(ms.getId());
    if (closed) {
    	throw new ExecutorException("Executor was closed.");
    }
    if (queryStack == 0 && ms.isFlushCacheRequired()) {
    	clearLocalCache();
    }
    List<E> list;
    try {
        queryStack++;
        list = resultHandler == null ? (List<E>) localCache.getObject(key) : null;
        if (list != null) {
            handleLocallyCachedOutputParameters(ms, key, parameter,boundSql);
    	} else {
            //如果缓存中没有本次查找的值，那么从数据库中查询
            list = queryFromDatabase(ms, parameter, rowBounds,resultHandler, key, boundSql);
        }
    } finally {
    	queryStack--;
    } 
    if (queryStack == 0) {
        for (DeferredLoad deferredLoad : deferredLoads) {
        	deferredLoad.load();
        } 
        // issue #601
		deferredLoads.clear();
		if (configuration.getLocalCacheScope() == LocalCacheScope.STATEMENT){
            // issue #482 clearLocalCache();
		}
	} 
    return list;
} 
//从数据库查询java
private <E> List<E> queryFromDatabase(MappedStatement ms, Object parameter,RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
    List<E> list;
    localCache.putObject(key, EXECUTION_PLACEHOLDER);
    try {
        //查询的方法
        list = doQuery(ms, parameter, rowBounds, resultHandler, boundSql);
    } finally {
    	localCache.removeObject(key);
    } 
    //将查询结果放入缓存
    localCache.putObject(key, list);
    if (ms.getStatementType() == StatementType.CALLABLE) {
    	localOutputParameterCache.putObject(key, parameter);
    }
    return list;
    }
// SimpleExecutor中实现父类的doQuery抽象方法
public <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) throws SQLException {
    Statement stmt = null;
    try {
        Configuration configuration = ms.getConfiguration();
        //传入参数创建StatementHanlder对象来执行查询
        StatementHandler handler =
        configuration.newStatementHandler(wrapper, ms, parameter, rowBounds,
        resultHandler, boundSql);
        //创建jdbc中的statement对象
        stmt = prepareStatement(handler, ms.getStatementLog());
        // StatementHandler 进行处理
        return handler.query(stmt, resultHandler);
    } finally {
    	closeStatement(stmt);
    }
  } 
//创建Statement的方法
private Statement prepareStatement(StatementHandler handler, Log statementLog) throws SQLException {
    Statement stmt;
    //条代码中的getConnection方法经过重重调用最后会调用openConnection方法，从连接池中获 得连接。
    Connection connection = getConnection(statementLog);
    stmt = handler.prepare(connection, transaction.getTimeout());
    handler.parameterize(stmt);
    return stmt;
    }
//从连接池获得连接的方法
protected void openConnection() throws SQLException {
    if (log.isDebugEnabled()) {
    	log.debug("Opening JDBC Connection");
    } 
    //从连接池获得连接
    connection = dataSource.getConnection();
    if (level != null) {
    	connection.setTransactionIsolation(level.getLevel());
    }
}
```

上述的Executor.query()方法几经转折，最后会创建一个StatementHandler对象，然后将必要的参数传递给StatementHandler，使用StatementHandler来完成对数据库的查询，最终返回List结果集。从上面的代码中我们可以看出，Executor的功能和作用是 :

(1、根据传递的参数，完成SQL语句的动态解析，生成BoundSql对象，供StatementHandler使用；
(2、为查询创建缓存，以提高性能
(3、创建JDBC的Statement连接对象，传递给*StatementHandler*对象，返回List查询结果。  



#### StatementHandler

StatementHandler对象主要完成两个工作：  

- 对于JDBC的PreparedStatement类型的对象，创建的过程中，我们使用的是SQL语句字符串会包含若干个？占位符，我们其后再对占位符进行设值。StatementHandler通过parameterize(statement)方法对 Statement 进行设值；
- StatementHandler 通过 List query(Statement statement, ResultHandler resultHandler)方法来完成执行Statement，和将Statement对象返回的resultSet封装成List；  

```java
  @Override
  public void parameterize(Statement statement) throws SQLException {
    registerOutputParameters((CallableStatement) statement);
      //使用ParameterHandler对象来完成对Statement的设值
    parameterHandler.setParameters((CallableStatement) statement);
  }
```

```java
 /**
 * 对某一个statement进行参数设置
 */
  @Override
  public void setParameters(PreparedStatement ps) {
    ErrorContext.instance().activity("setting parameters").object(mappedStatement.getParameterMap().getId());
    List<ParameterMapping> parameterMappings = boundSql.getParameterMappings();
    if (parameterMappings != null) {
      for (int i = 0; i < parameterMappings.size(); i++) {
        ParameterMapping parameterMapping = parameterMappings.get(i);
        if (parameterMapping.getMode() != ParameterMode.OUT) {
          Object value;
          String propertyName = parameterMapping.getProperty();
          if (boundSql.hasAdditionalParameter(propertyName)) { // issue #448 ask first for additional params
            value = boundSql.getAdditionalParameter(propertyName);
          } else if (parameterObject == null) {
            value = null;
          } else if (typeHandlerRegistry.hasTypeHandler(parameterObject.getClass())) {
            value = parameterObject;
          } else {
            MetaObject metaObject = configuration.newMetaObject(parameterObject);
            value = metaObject.getValue(propertyName);
          }
          // 每一个 Mapping都有一个 TypeHandler，根据 TypeHandler 来对 preparedStatement 进 行设置参数
          TypeHandler typeHandler = parameterMapping.getTypeHandler();
          JdbcType jdbcType = parameterMapping.getJdbcType();
          if (value == null && jdbcType == null) {
            jdbcType = configuration.getJdbcTypeForNull();
          }
          try {
            // 设置参数
            typeHandler.setParameter(ps, i + 1, value, jdbcType);
          } catch (TypeException | SQLException e) {
            throw new TypeException("Could not set parameters for mapping: " + parameterMapping + ". Cause: " + e, e);
          }
        }
      }
    }
  }
```

从上述的代码可以看到,StatementHandler的parameterize(Statement)方法调用了ParameterHandler的setParameters(statement)方法，ParameterHandler的setParameters(Statement )方法负责根据我们输入的参数，对statement对象的 ?占位符处进行赋值。进入到StatementHandler 的 List query(Statement statement, ResultHandler resultHandler)方法的实现： 

```java
    public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {
        // 1.调用preparedStatemnt.execute()方法，然后将resultSet交给ResultSetHandler处理
        PreparedStatement ps = (PreparedStatement)statement;
        ps.execute();
        //2.使用 ResultHandler 来处理 ResultSet
        return this.resultSetHandler.handleResultSets(ps);
    }
```

从上述代码我们可以看出，StatementHandler 的List query(Statement statement, ResultHandlerresultHandler)方法的实现，是调用了 ResultSetHandler 的 handleResultSets(Statement)方法。ResultSetHandler 的 handleResultSets(Statement)方法会将 Statement 语句执行后生成的 resultSet结果集转换成List结果集 

```java
 public List<Object> handleResultSets(Statement stmt) throws SQLException {
        ErrorContext.instance().activity("handling results").object(this.mappedStatement.getId());
        //多ResultSet的结果集合，每个ResultSet对应一个Object对象。而实际上，每 个 Object 是List<Object> 对象。
	    //在不考虑存储过程的多ResultSet的情况，普通的查询，实际就一个ResultSet，也 就是说，multipleResults最多就一个元素。
        List<Object> multipleResults = new ArrayList();
        int resultSetCount = 0;
        //获得首个ResultSet对象，并封装成ResultSetWrapper对象
        ResultSetWrapper rsw = this.getFirstResultSet(stmt);
        //获得ResultMap数组 在不考虑存储过程的多ResultSet的情况，普通的查询，实际就一个ResultSet，也 就是说，resultMaps就一个元素。
        List<ResultMap> resultMaps = this.mappedStatement.getResultMaps();
        int resultMapCount = resultMaps.size();
        // 校验
        this.validateResultMapsCount(rsw, resultMapCount);

        while(rsw != null && resultMapCount > resultSetCount) {
            //获得ResultMap对象
            ResultMap resultMap = (ResultMap)resultMaps.get(resultSetCount);
            //处理ResultSet，将结果添加到multipleResults中
            this.handleResultSet(rsw, resultMap, multipleResults, (ResultMapping)null);
            // 获得下一个ResultSet对象，并封装成ResultSetWrapper对象
            rsw = this.getNextResultSet(stmt);
            // 清理
            this.cleanUpAfterHandlingResultSet();
            ++resultSetCount;
        }
		// 因为'mappedStatement.resultSets'只在存储过程中使用，本系列暂时不考虑，忽略即可
        String[] resultSets = this.mappedStatement.getResultSets();
        if (resultSets != null) {
            while(rsw != null && resultSetCount < resultSets.length) {
                ResultMapping parentMapping = (ResultMapping)this.nextResultMaps.get(resultSets[resultSetCount]);
                if (parentMapping != null) {
                    String nestedResultMapId = parentMapping.getNestedResultMapId();
                    ResultMap resultMap = this.configuration.getResultMap(nestedResultMapId);
                    this.handleResultSet(rsw, resultMap, (List)null, parentMapping);
                }

                rsw = this.getNextResultSet(stmt);
                this.cleanUpAfterHandlingResultSet();
                ++resultSetCount;
            }
        }
		// 如果是multipleResults单元素，则取首元素返回
        return this.collapseSingleResultList(multipleResults);
    }
```



### 10.2 Mapper代理方式

```java
public static void main(String[] args) {
    //前三步都相同
    InputStream inputStream = Resources.getResourceAsStream("sqlMapConfig.xml");
    SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(inputStream);
    SqlSession sqlSession = factory.openSession();
    //这里不再调用SqlSession的api,而是获得了接口对象，调用接口中的方法。
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> list = mapper.getUserByName("tom");
}
```

在mapper接口我们都没有具体的方法实现，是因为使用了**动态代理**

在Mybatis初始化对接口的处理： MapperRegistry是Configuration中的一个属性，内部维护一个HashMap用于存放mapper接口的工厂类，每个接口对应一个工厂类。mappers中可以配置接口的包路径，或者某个具体的接口类。  

```xml
<mappers>
    <mapper class="com.lagou.mapper.UserMapper"/>
    <package name="com.lagou.mapper"/>
</mappers>
```

当解析mappers标签时，自动判断mapper是文件，就对应的解析封装成MappedStatement对象存入mappedStatements中。

解析到接口是： 会建立此接口对应的MapperProxyFactory对象，存入HashMap中，key=接口的字节码对象，value=接口对应的MapperProxyFactory对象。



##### getMapper()

进入 sqlSession.getMapper(UserMapper.class )中  

```java
//DefaultSqlSession 中的 getMapper
public <T> T getMapper(Class<T> type) {
   return this.configuration.getMapper(type, this);
}


// configuration中的getMapper
  @Override
  public <T> T getMapper(Class<T> type) {
    return configuration.getMapper(type, this);
  }

//MapperRegistry 中的 getMapper
  public <T> T getMapper(Class<T> type, SqlSession sqlSession) {
    // 从 MapperRegistry 中的 HashMap 中拿 MapperProxyFactory
    final MapperProxyFactory<T> mapperProxyFactory = (MapperProxyFactory<T>) knownMappers.get(type);
    if (mapperProxyFactory == null) {
      throw new BindingException("Type " + type + " is not known to the MapperRegistry.");
    }
    try {
        //通过动态代理工厂生成示例。
      return mapperProxyFactory.newInstance(sqlSession);
    } catch (Exception e) {
      throw new BindingException("Error getting mapper instance. Cause: " + e, e);
    }
  }


//MapperProxyFactory 类中的 newInstance 方法
public T newInstance(SqlSession sqlSession) {
    //创建了 JDK动态代理的Handler类
    final MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession,
    mapperInterface, methodCache);
    //调用了重载方法
    return newInstance(mapperProxy);
}


//MapperProxy 类，实现了 InvocationHandler 接口
public class MapperProxy<T> implements InvocationHandler, Serializable {
	//省略部分源码
    private final SqlSession sqlSession;
    private final Class<T> mapperInterface;
    private final Map<Method, MapperMethod> methodCache;
    //构造，传入了 SqlSession，说明每个session中的代理对象的不同的！
    public MapperProxy(SqlSession sqlSession, Class<T> mapperInterface,
    Map<Method, MapperMethod> methodCache) {
    this.sqlSession = sqlSession;
    this.mapperInterface = mapperInterface;
    this.methodCache = methodCache;
} 
//省略部分源码
```



##### invoke()

在动态代理返回了示例后，我们就可以直接调用mapper类中的方法了，但代理对象调用方法，执行是在MapperProxy中的invoke方法中  

```java
  @Override
    public Object invoke(Object proxy, Method method, Object[] args, SqlSession sqlSession) throws Throwable {
      //重点在这：MapperMethod最终调用了执行的方法
      return mapperMethod.execute(sqlSession, args);
    }
```

进入execute方法

```java

  public Object execute(SqlSession sqlSession, Object[] args) {
    Object result;
      //判断mapper中的方法类型，最终调用的还是SqlSession中的方法 switch(command.getType()) 
    switch (command.getType()) {
      case INSERT: {
        // 执行insert操作，返回rowCount
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.insert(command.getName(), param));
        break;
      }
      case UPDATE: {
        // 执行update参错，返回rowCount
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.update(command.getName(), param));
        break;
      }
      case DELETE: {
        // 执行delete操作，返回rowCount
        Object param = method.convertArgsToSqlCommandParam(args);
        result = rowCountResult(sqlSession.delete(command.getName(), param));
        break;
      }
      case SELECT:
        // 执行select操作，没有返回，但是有ResultHandler，则由Resulthandler方法来进行处理
        if (method.returnsVoid() && method.hasResultHandler()) {
          executeWithResultHandler(sqlSession, args);
          result = null;
        } else if (method.returnsMany()) {
          // 返回列表
          result = executeForMany(sqlSession, args);
        } else if (method.returnsMap()) {
          // 返回map
          result = executeForMap(sqlSession, args);
        } else if (method.returnsCursor()) {
          // 返回cursor
          result = executeForCursor(sqlSession, args);
        } else {
         // 执行查询，返回单个对象
          Object param = method.convertArgsToSqlCommandParam(args);
          result = sqlSession.selectOne(command.getName(), param);
          if (method.returnsOptional()
              && (result == null || !method.getReturnType().equals(result.getClass()))) {
            result = Optional.ofNullable(result);
          }
        }
        break;
      case FLUSH:
        result = sqlSession.flushStatements();
        break;
      default:
        throw new BindingException("Unknown execution method for: " + command.getName());
    }
    // 返回结果为null，并且返回类型为基本类型，则抛出BindingException异常
    if (result == null && method.getReturnType().isPrimitive() && !method.returnsVoid()) {
      throw new BindingException("Mapper method '" + command.getName()
          + " attempted to return null from a method with a primitive return type (" + method.getReturnType() + ").");
    }
    // 具体返回
    return result;
  }
```





## 第十一部分： 设计模式

mybatis中运用了大量的设计模式

| 模式          | mybatis 体现                                                 |
| ------------- | ------------------------------------------------------------ |
| Builder模式   | 例如SqlSessionFactoryBuilder、Environment;                   |
| 工厂方法模式  | 例如SqlSessionFactory、TransactionFactory、LogFactory        |
| 单例模式      | 例如 ErrorContext 和 LogFactory；                            |
| 代理模式      | Mybatis实现的核心，比如MapperProxy、ConnectionLogger，用的jdk的动态代理还有executor.loader包使用了 cglib或者javassist达到延迟加载的效果 |
| 组合模式      | 例如SqlNode和各个子类ChooseSqlNode等；                       |
| 模板方 法模式 | 例如 BaseExecutor 和 SimpleExecutor，还有 BaseTypeHandler 和所有的子类例如 IntegerTypeHandler； |
| 适配器模式    | 例如Log的Mybatis接口和它对jdbc、log4j等各种日志框架的适配实现； |
| 装饰者模式    | 例如Cache包中的cache.decorators子包中等各个装饰者的实现；    |
| 迭代器模式    | 例如迭代器模式PropertyTokenizer；                            |



#### 11.1 Builder构建者模式

Builder模式的定义是"将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。”，它属于创建类模式，一般来说，如果一个对象的构建比较复杂，超出了构造函数所能包含的范围，就可以使用工厂模式和Builder模式，相对于工厂模式会产出一个完整的产品，Builder应用于更加复杂的对象构建，甚至只会构建产品的一个部分，直白来说，就是使用多个简单的对象一步一步构建成一个复杂的对象 

SqlSessionFactory 的构建过程：
Mybatis的初始化工作非常复杂，不是只用一个构造函数就能搞定的。所以使用了建造者模式，使用了大 量的Builder，进行分层构造，核心对象Configuration使用了 XmlConfigBuilder来进行构造 

![image-20230305202652970](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E6%9E%84%E5%BB%BA%E8%80%85%E6%A8%A1%E5%BC%8F.png)

在Mybatis环境的初始化过程中，SqlSessionFactoryBuilder会调用XMLConfigBuilder读取所有的MybatisMapConfig.xml 和所有的 *Mapper.xml 文件，构建 Mybatis 运行的核心对象 Configuration对 象，然后将该Configuration对象作为参数构建一个SqlSessionFactory对象。  

```java
private void parseConfiguration(XNode root) {
    try {
    //issue #117 read properties first
    //解析<properties />标签
    propertiesElement(root.evalNode("properties"));
    // 解析 <settings /> 标签
    Properties settings = settingsAsProperties(root.evalNode("settings"));
    //加载自定义的VFS实现类
    loadCustomVfs(settings);
    // 解析 <typeAliases /> 标签
    typeAliasesElement(root.evalNode("typeAliases"));
    //解析<plugins />标签
    pluginElement(root.evalNode("plugins"));
    // 解析 <objectFactory /> 标签
    objectFactoryElement(root.evaINode("obj ectFactory"));
    // 解析 <objectWrapper Factory /> 标签
    obj ectWrappe rFacto ryElement(root.evalNode("objectWrapperFactory"));
    // 解析 <reflectorFactory /> 标签
    reflectorFactoryElement(root.evalNode("reflectorFactory"));
    // 赋值 <settings /> 到 Configuration 属性
    settingsElement(settings);
    // read it after objectFactory and objectWrapperFactory issue #631
    // 解析 <environments /> 标签
    environmentsElement(root.evalNode("environments"));
    // 解析 <databaseIdProvider /> 标签
    databaseldProviderElement(root.evalNode("databaseldProvider"));
}
```

其中 XMLConfigBuilder 在构建 Configuration 对象时，也会调用 XMLMapperBuilder 用于读取*Mapper 文件，而XMLMapperBuilder会使用XMLStatementBuilder来读取和build所有的SQL语句。  

```java
//解析<mappers />标签
mapperElement(root.evalNode("mappers"));
```

在这个过程中，有一个相似的特点，就是这些Builder会读取文件或者配置，然后做大量的XpathParser解析、配置或语法的解析、反射生成对象、存入结果缓存等步骤，这么多的工作都不是一个构造函数所能包括的，因此大量采用了 Builder模式来解决 

![image-20230305202852053](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-sqlSessionFactoryBuilder.png)



SqlSessionFactoryBuilder类根据不同的输入参数来构建SqlSessionFactory这个工厂对象  



#### 11.2 工厂模式

在Mybatis中比如SqlSessionFactory使用的是工厂模式，该工厂没有那么复杂的逻辑，是一个简单工厂模式。简单工厂模式(Simple Factory Pattern)：又称为静态工厂方法(Static Factory Method)模式，它属于创建型模式。在简单工厂模式中，可以根据参数的不同返回不同类的实例。简单工厂模式专门定义一个类来负创建其他类的实例，被创建的实例通常都具有共同的父类 。

Mybatis中执行Sql语句、获取Mappers、管理事务的核心接口SqlSession的创建过程使用到了工厂模
式。有一个 SqlSessionFactory 来负责 SqlSession 的创建  

![image-20230305203307144](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/mybatis/imgmybatis-%E5%B7%A5%E5%8E%82%E6%A8%A1%E5%BC%8F.png)

SqlSessionFactory可以看到，该Factory的openSession ()方法重载了很多个，分别支持autoCommit、Executor、Transaction等参数的输入，来构建核心的SqlSession对象。在DefaultSqlSessionFactory的默认工厂实现里，有一个方法可以看出工厂怎么产出一个产品:  

```java
  private SqlSession openSessionFromDataSource(ExecutorType execType, TransactionIsolationLevel level, boolean autoCommit) {
    Transaction tx = null;
    try {
      final Environment environment = configuration.getEnvironment();
      final TransactionFactory transactionFactory = getTransactionFactoryFromEnvironment(environment);
      tx = transactionFactory.newTransaction(environment.getDataSource(), level, autoCommit);
      //根据参数创建制定类型的Executor
      final Executor executor = configuration.newExecutor(tx, execType);
      //返回的是 DefaultSqlSession
      return new DefaultSqlSession(configuration, executor, autoCommit);
    } catch (Exception e) {
      closeTransaction(tx); // may have fetched a connection so lets call close()
      throw ExceptionFactory.wrapException("Error opening session.  Cause: " + e, e);
    } finally {
      ErrorContext.instance().reset();
    }
  }
```

这是一个openSession调用的底层方法，该方法先从configuration读取对应的环境配置，然后初始化TransactionFactory 获得一个 Transaction 对象，然后通过 Transaction 获取一个 Executor 对象，最后通过configuration、Executor、是否autoCommit三个参数构建了 SqlSession 

#### 11.3 代理模式

代理模式(Proxy Pattern):给某一个对象提供一个代理，并由代理对象控制对原对象的引用。代理模式的英文叫做Proxy，它是一种对象结构型模式，代理模式分为静态代理和动态代理，我们来介绍动态代理 

代理模式实例：

```java
/**
* JDK动态代理
* 需实现 InvocationHandler 接口 */
public class JDKDynamicProxy implements InvocationHandler {
    //被代理的对象
    Person target;
    // JDKDynamicProxy 构造函数
public JDKDynamicProxy(Person person) {
    this.target = person;
} 
    //获取代理对象
public Person getTarget() { return (Person)
    Proxy.newProxylnstance(target.getClass().getClassLoader(),
    target.getClass().getInterfaces(), this);
} 
    //动态代理invoke方法
public Person invoke(Object proxy, Method method, Object[] args) throws Throwable {
    //被代理方法前执行
    System.out.println("JDKDynamicProxy do something before!");
    //执行被代理的方法
    Person result = (Person) method.invoke(target, args);
    //被代理方法后执行
    System.out.println("JDKDynamicProxy do something after!"); return
    result;
}
```

代理模式可以认为是Mybatis的核心使用的模式，正是由于这个模式，我们只需要编写Mapper.java接口，不需要实现，由Mybati s后台帮我们完成具体SQL的执行。当我们使用Configuration的getMapper方法时，调用mapperRegistry.getMapper方法，而该方法又会调用 apperProxyFactory.newInstance(sqlSession)来生成一个具体的代理：  

```java
/**
 * @author Lasse Voss
 */
public class MapperProxyFactory<T> {

  private final Class<T> mapperInterface;
  private final Map<Method, MapperMethodInvoker> methodCache = new ConcurrentHashMap<>();

  public MapperProxyFactory(Class<T> mapperInterface) {
    this.mapperInterface = mapperInterface;
  }

  public Class<T> getMapperInterface() {
    return mapperInterface;
  }

  public Map<Method, MapperMethodInvoker> getMethodCache() {
    return methodCache;
  }
  // 使用了代理对象，最终转为MapperProxy
  @SuppressWarnings("unchecked")
  protected T newInstance(MapperProxy<T> mapperProxy) {
    return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), new Class[] { mapperInterface }, mapperProxy);
  }

  public T newInstance(SqlSession sqlSession) {
    final MapperProxy<T> mapperProxy = new MapperProxy<>(sqlSession, mapperInterface, methodCache);
    return newInstance(mapperProxy);
  }

}
```

非常典型的，该MapperProxy类实现了InvocationHandler接口，并且实现了该接口的invoke方法。通过这种方式，我们只需要编写Mapper.java接口类，当真正执行一个Mapper接口的时候，就会转发给MapperProxy.invoke方法，而该方法则会调用后续的sqlSession.cud>executor.execute>prepareStatement 等一系列方法，完成 SQL 的执行和返回  