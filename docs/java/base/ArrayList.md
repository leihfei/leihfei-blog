# ArrayList



## 一、基础回顾

### 1. 成员变量

```java
    /**
     * Default initial capacity.
     * 默认初始容量
     */
    private static final int DEFAULT_CAPACITY = 10;

    /**
     当指定数组的容量为0时，使用这个常量进行赋值（初始化）
     */
    private static final Object[] EMPTY_ELEMENTDATA = {};

    /**
     默认无参构造函数时，使用这个常量进行赋值（初始化）
     */
    private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

    /**
   
     真正存放数据的对象数组，transient 标识不被序列化
     */
    transient Object[] elementData; // non-private to simplify nested class access

    /**
     * 元素个个数记录
     */
    private int size;

 /**
     最大数组元素个数
     */
    private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;
```



### 2. 构造方法

- 无参数构造

- 一参数构造，指定数组长度

- ArrayList(Collection<? extends E> c),指定元素的列表集合构造

  ```java
  public ArrayList(Collection<? extends E> c) {
      // 进行元素转换复制
      elementData = c.toArray();
      if ((size = elementData.length) != 0) {
          // c.toArray might (incorrectly) not return Object[] (see 6260652)
          if (elementData.getClass() != Object[].class)
              // 转换为Object类型，使用Arrays.copyOf来进行拷贝
              elementData = Arrays.copyOf(elementData, size, Object[].class);
      } else {
          // replace with empty array.
          this.elementData = EMPTY_ELEMENTDATA;
      }
  }
  ```

  

### 3. 类结构

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{

```

- 实现了List接口，拥有List的基本增删改查功能
- 实现RandomAccess接口，提供了随机快速读写的功能，我们可以通过元素的需要快速访问元素
- 实现了Cloneable接口，可以被克隆
- 实现了Serializable序列化接口



## 二、方法解析

### 1. add方法

```java
   public boolean add(E e) {
        // 进行modCount++，初始化，扩容等功能
        ensureCapacityInternal(size + 1);  // Increments modCount!!
        // 将制定位置的数组赋值
        elementData[size++] = e;
        return true;
    }
```

方法解释：

- ensureCapacityInternal(size + 1),方法中判断数组是否为空，为空，利用Math.max比较size和默认值，返回默认值

- modCount+1

- 判断是否需要进行扩容，当元素+1大于数组当前长度进行扩容

  ```java
  private void ensureExplicitCapacity(int minCapacity) {
      modCount++;
      // 检查是否进行扩容 overflow-conscious code
      if (minCapacity - elementData.length > 0)
          grow(minCapacity);
  }
  ```

- 扩容grow函数，

```java
private void grow(int minCapacity) {
    // overflow-conscious code
    // 复制原始数组的长度
    int oldCapacity = elementData.length;
    // 新数组长度=原始数组长度+原始数组长度的一半，也就是1.5倍
    // 右移运算符，num >> 1,相当于num除以2，也就是扩充 原来的 1.5倍。
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    // 如果新长度-应该的长度，那么新长度重新赋值
    if (newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    // 如果新长度大于最大长度，设置为最大Integer.Max_value,或者-8
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    // 进行元素的拷贝到新数组
    elementData = Arrays.copyOf(elementData, newCapacity);
}

  private static int hugeCapacity(int minCapacity) {
        if (minCapacity < 0) // overflow
            throw new OutOfMemoryError();
      	// minCapacity > Integer.MAX_VALUE-8,那么新数组设置为Integer.MAX_VALUE,否则就为Integer.MAX_VALUE-8
        return (minCapacity > MAX_ARRAY_SIZE) ?
            Integer.MAX_VALUE :
            MAX_ARRAY_SIZE;
    }
```



### 2. add(int index,E element)，指定位置add方法

```java
public void add(int index, E element) {
    // 检查数组是否越界
    rangeCheckForAdd(index);
    // 检查是否需要扩容
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 对需要插叙的位置，后面的数据进行拷贝到后一个位置
    System.arraycopy(elementData, index, elementData, index + 1,
                     size - index);
    // 将元素插入到响应位置
    elementData[index] = element;
    size++;
}
```



### 3. remove移除方法

```java
public E remove(int index) {
    // 检查是否越界
    rangeCheck(index);
    // 修改次数++
    modCount++;
    // 获取到需要删除的元素，通过下标获取
    E oldValue = elementData(index);
    // 需要移动的数组长度，删除后需要向前移动
    int numMoved = size - index - 1;
    if (numMoved > 0)
        // 如果需要移动，使用函数拷贝
        System.arraycopy(elementData, index+1, elementData, index,
                         numMoved);
    // 将数组的最后一个元素设置为空
    elementData[--size] = null; // clear to let GC do its work
    // 返回待删除的元素
    return oldValue;
}

/**
*通过元素内容移除元素，都是比较equals方法进行元素的移动，删除
*/
public boolean remove(Object o) {
        // 如果要删除的元素为空
        if (o == null) {
            for (int index = 0; index < size; index++)
                if (elementData[index] == null) {
                    fastRemove(index);
                    return true;
                }
        } else {
            // 要删除的元素不为空
            for (int index = 0; index < size; index++)
                // 通过比较元素的equals方法进行删除元素
                if (o.equals(elementData[index])) {
                    fastRemove(index);
                    return true;
                }
        }
        return false;
    }

    /*
     * Private remove method that skips bounds checking and does not
     * return the value removed.
     */
    private void fastRemove(int index) {
        // 元素修改++
        modCount++;
        // 移动元素的长度
        int numMoved = size - index - 1;
        if (numMoved > 0)
            // 拷贝元素
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        // 最后一个值设置为空
        elementData[--size] = null; // clear to let GC do its work
    }
```



## 三、面试题

### 1. 集合框架

![image-20220211165230193](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/java_base/image-20220211165230193.png)





### 2. 什么```elementData```实用**transient**修饰？

- transient作用于该属性不参与序列化

- ArrayList继承了标识序列化的Serializable接口

- 对ArrayList序列化的过程进行了读写安全控制

  重写了序列化的writeObject,readObject方法



### 3. java中的Queue接口

```java
public interface Queue<E> extends Collection<E> {
   	//集合中插入元素
    boolean add(E e);
    //队列中插入元素
    boolean offer(E e);
    //移除元素，当集合为空，抛出异常
    E remove();
    //移除队列头部元素并返回，如果为空，返回null
    E poll();
    //查询集合第一个元素，如果为空，抛出异常
    E element();
    //查询队列中第一个元素，如果为空，返回null
    E peek();
}	
```



### 3. ```LinkedList```结构

是双向链表，默认size=0

```java
transport Node<E> first

transport Node<E> last
```



构造函数为无参构造



插入方法，头插法，尾插法，add方法默认使用尾插法

```java
/**
 * Links e as first element.
 */
private void linkFirst(E e) {
    final Node<E> f = first;
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;
    if (f == null)
        last = newNode;
    else
        f.prev = newNode;
    size++;
    modCount++;
}

/**
 * Links e as last element.
 */
void linkLast(E e) {
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
}
```



### 4. ```ArrayList 和 LinkedList``` 的区别是什么？

最明显的区别是 ArrrayList底层的数据结构是数组，支持随机访问，而 LinkedList 的底层数据结构是双向循环链表，不支持随机访问。使用下标访问一个元素，ArrayList 的时间复杂度是 O(1)，而 LinkedList 是 O(n)。



### 5. 如何实现数组和 List 之间的转换？

List转换成为数组：调用ArrayList的toArray方法。

数组转换成为List：调用Arrays的asList方法。



### 6. ArrayList 和 Vector 的区别是什么？

Vector是线程同步的，而ArrayList不是。然而，如果你寻求在迭代的时候对列表进行改变，你应该使用CopyOnWriteArrayList。

ArrayList比Vector快，它因为有同步，不会过载。

ArrayList更加通用，因为我们可以使用Collections工具类轻易地获取同步列表和只读列表。



### 7. Array 和 ArrayList 有何区别？

Array可以容纳基本类型和对象，而ArrayList只能容纳对象。

Array是指定大小后不可变的，而ArrayList大小是可变的。

Array没有提供ArrayList那么多功能，比如addAll、removeAll和iterator等。



### 8. 在 Queue 中 poll()和 remove()有什么区别？

poll() 和 remove() 都是从队列中取出一个元素，但是 poll() 在获取元素失败的时候会返回空，但是 remove() 失败的时候会抛出异常。



### 9 .哪些集合类是线程安全的？

vector：就比arraylist多了个同步化机制（线程安全），因为效率较低，现在已经不太建议使用。在web应用中，特别是前台页面，往往效率（页面响应速度）是优先考虑的。

statck：堆栈类，先进后出。

hashtable：就比hashmap多了个线程安全。

enumeration：枚举，相当于迭代器。



### 10.Iterator 和 ListIterator 有什么区别？

Iterator可用来遍历Set和List集合，但是ListIterator只能用来遍历List。

Iterator对集合只能是前向遍历，ListIterator既可以前向也可以后向。

ListIterator实现了Iterator接口，并包含其他的功能，比如：增加元素，替换元素，获取前一个和后一个元素的索引



### 11. List,Set,Map之间的区别



![image-20220211173014489](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/java_base/image-20220211173014489.png)



### 12. HashSet原理

- 是基于HashMap实现的，默认构造函数是构建一个初始容量为16，负载因子为0.75 的HashMap。封装了一个 HashMap 对象来存储所有的集合元素，所有放入 HashSet 中的集合元素实际上由 HashMap 的 key 来保存，而 HashMap 的 value 则存储了一个 PRESENT，它是一个静态的 Object 对象。
- 当我们试图把某个类的对象当成 HashMap的 key，或试图将这个类的对象放入 HashSet 中保存时，重写该类的equals(Object obj)方法和hashCode() 方法很重要，而且这两个方法的返回值必须保持一致：当该类的两个的 hashCode() 返回值相同时，它们通过 equals() 方法比较也应该返回 true。通常来说，所有参与计算 hashCode() 返回值的关键属性，都应该用于作为 equals() 比较的标准。
- HashSet的其他操作都是基于HashMap的。

