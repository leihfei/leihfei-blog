# HashMap



##  一、基础回顾

### 1. HashMap的成员变量



```java
public class HashMap<K, V> extends AbstractMap<K, V>
        implements Map<K, V>, Cloneable, Serializable {
      /** 集合初始化容量,必须是2的n次幂，默认的初始容量是16 */
    static final int DEFAULT_INITIAL_CAPACITY = 1 << 4;

    /** 集合最大容量,默认为2的30次幂 */
    static final int MAXIMUM_CAPACITY = 1 << 30;

    /** 默认加载因子,默认值 0.75 */
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

    /** 当链表元素数量超过该值,则会转为红黑树（jdk1.8新增） */
    static final int TREEIFY_THRESHOLD = 8;

    /** 当红黑树元素的值小于6,则会从红黑树转回链表 */
    static final int UNTREEIFY_THRESHOLD = 6;

    /** 当存放元素数量超过该值,表中的桶才能转换为红黑树,否则桶内元素超过指定条件时只会进行扩容 */
    static final int MIN_TREEIFY_CAPACITY = 64;

    /** 数组结构 */
    transient Node<K,V>[] table;

    /**存放缓存数据 */
    transient Set<Entry<K,V>> entrySet;

    /**存放元素数量 */
    transient int size;

    /** 用来记录HashMap修改次数,即每次扩容和更改map结构的计数器 */
    transient int modCount;

    /** 扩容临界值,当存放元素数量超过临界值（容量*负载因子）时，会进行扩容 */
    int threshold;

    /** 哈希表加载因子 */
    final float loadFactor;
}
```

Node<K,V>类结构：

```java
static class Node<K,V> implements Entry<K,V> {
    	/** 元素的hash值 */
        final int hash;
    	/** key值 */
        final K key;
    	/** value值 */
        V value;
    	/** 下一个节点的 */
        Node<K,V> next;
}
```



### 2. 构造函数

- 无参数构造方法，负载因子=默认的负载因子

- 一个参数，初始容量大小，直接调用两参数构造

- 两个参数构造，参数为：初始容量大小，默认负载因子

  ```java
     /**
       * Returns a power of two size for the given target capacity.
       */
      static final int tableSizeFor(int cap) {
          int n = cap - 1; 
          n |= n >>> 1;
          n |= n >>> 2;
          n |= n >>> 4;
          n |= n >>> 8;
          n |= n >>> 16;
          return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
      }
  其目的是要获得大于cap的最小的2的幂
  ```

  



### 3. HashMap的相关说明

- 底层数据结构： 数组+链表+红黑树

  ![image-20220211143706461](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20220211143706461.png)

- 链表转红黑树条件： 阈值为8，数组整体长度必须大于64，如果链表元素到8，但是整体元素64，那么数组将进行扩容，而不是转红黑树

- 红黑树转链表条件： 红黑树元素个数小于6

- 在new HashMap时，不会进行数组的初始化，在put的时候才会进行，判断数组为空或者length为零，调用resize扩容初始化

- key可以有一个为null,value无限制

- 存储元素是无序的





## 二、方法源码解析



### 1. hash函数说明

```java
    static final int hash(Object key) {
        int h;
        return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
    }
```

hash函数：通过hashCode()的高16位异或低16位实现，主要是从速度、功效、质量来考虑的。以上方法得到的int的hash值，然后再通过`h & (table.length -1)`来得到该对象在数据中保存的位置。

h>>>16其实就是扰动算法，目的是为了保留高16位和低16位的特性





### 2. put方法

- 计算hash值，调用putVal方法，设置onlyIfAbsent=false
- putVal方法中，检查table是否为空，为空调用resize进行默认扩容
- 检查table桶位置元素是否为空，为空直接放入元素
- 否则，获取到该table桶位置的第一个元素，判断是否和目前的传递的的元素hash相同，key相同，如果是，那么就进行赋值，并且进入到后续环节（设置新值，返回旧值，方法结束）
- 否则，判断是否为TreeNode节点（红黑树节点），是红黑树，调用putTreeVal加入红黑树，然后自平衡等
- 不是红黑树，进行链表遍历，记录binCount遍历的值（主要用于判断是否需要转换红黑树）
- 遍历过程中，需要检查遍历的元素是否是当前插入元素（hash值和key相同），否则使用尾插法进行插入到最后一个位置，插入之后需要检查是否需要转换红黑树
- 最后记录modCount修改次数，并且判断size是否大于扩容阈值，检查是否扩容，然后返回null

![20200628084624157](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/20200628084624157.png)

代码如下所示：

```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        // 判断数组是否为空，如果为空，那么进行resize进行数据初始化
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        // 判断数组中这个位置是否为空，如果为空，直接放入数据
        if ((p = tab[i = (n - 1) & hash]) == null)
            tab[i] = newNode(hash, key, value, null);
        else {
            // 否则，说明该位置存在元素，出现了hash冲突
            Node<K,V> e; K k;
            if (p.hash == hash &&
                    ((k = p.key) == key || (key != null && key.equals(k))))
                // 说明hash值相同，并且元素的key值也相同，那么将当前数组位置的元素P赋值给e
                e = p;
            else if (p instanceof TreeNode)
                // key值不相同，说明是新的元素，那么这里判断是否是原来的位置的元素是不是红黑树，如果是红黑树，那么添加到红黑树中
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                // 不是红黑树，那么就是链表，需要进行链表的尾部插入追加
                // binCount就是记录在hash位置的数组元素个数
                for (int binCount = 0; ; ++binCount) {
                    // 链表数据的死循环查询
                    if ((e = p.next) == null) {
                        // 数组元素的下一个节点为空，那么元素就插入在这里
                        p.next = newNode(hash, key, value, null);
                        // 判断元素个数是否满足转换红黑树条件，大于等于8
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            // 转换为红黑树
                            treeifyBin(tab, hash);
                        break;
                    }
                    // 判断元素是否是和原来存储的元素相同，如果是，那么就跳出循环，结束
                    if (e.hash == hash &&
                            ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    // 交换元素继续执行循环
                    p = e;
                }
            }
            // 说明本次put的值就原始已经存在的key，那么在这里完成旧key的修改
            if (e != null) { // existing mapping for key
                // 复制现在的值
                V oldValue = e.value;
                // onlyIfAbsent=false
                if (!onlyIfAbsent || oldValue == null)
                    // 修改原来的值为新值
                    e.value = value;
                // 回调
                afterNodeAccess(e);
                // 返回原来的值
                return oldValue;
            }
        }
        // 说明元素是新增，记录修改modCount次数
        ++modCount;
        // 判断数组长度，是否需要进行resize扩容
        if (++size > threshold)
            // 扩容数组
            resize();
        // 插入后回调
        afterNodeInsertion(evict);
        // 插入成功，返回Null
        return null;
    }
```





### 3. treeifyBin链表准备转为红黑树

```java
 /**
     * Replaces all linked nodes in bin at index for given hash unless
     * table is too small, in which case resizes instead.
     * 在满足一定条件的情况下，将链表转换成红黑树
     */
    final void treeifyBin(Node<K,V>[] tab, int hash) {
        int n, index; Node<K,V> e;
        if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
            // 判断数组是否为空，为空或者数组长度小于64默认值，那么就进行扩容
            resize();
        else if ((e = tab[index = (n - 1) & hash]) != null) {
            // 否则，需要转换红黑树，取出元素
            // 定义红黑树的头结点和尾节点
            TreeNode<K,V> hd = null, tl = null;
            do {
                // 将当前节点元素转换为红黑树节点
                TreeNode<K,V> p = replacementTreeNode(e, null);
                // 判断尾节点为空,第一次进入
                if (tl == null)
                    // 当前节点赋值为头节点
                    hd = p;
                else {
                    // 将单向链表转为双向链表
                    // 不是第一个元素了，需要将当前元素p节点的上一个节点设置为尾节点
                    p.prev = tl;
                    // 将尾节点的下一个元素指向当前p节点
                    tl.next = p;
                }
                // 当前节点赋值为尾节点
                tl = p;
            } while ((e = e.next) != null);
            if ((tab[index] = hd) != null)
                // 真正的将双向链表转为红黑树，将桶中的节点设置为红黑树的头结点，进行红黑树的整理翻转等
                hd.treeify(tab);
        }
    }
```



### 4. treeify转换红黑树

```java
  /**
         * Forms tree of the nodes linked from this node.
         * 将双向列表转为红黑树
         * @return root of tree
         */
        final void treeify(Node<K,V>[] tab) {
            // 存放数据的红黑树根节点
            TreeNode<K,V> root = null;
            // 遍历链表元素，this-当前节点，this表示当前节点，next表示下一个节点
            for (TreeNode<K,V> x = this, next; x != null; x = next) {
                next = (TreeNode<K,V>)x.next;
                // 设置当前节点的左右节点为null
                x.left = x.right = null;
                if (root == null) {
                    // 判断根节点是否为空，设置父节点为空，设置为红节点，当前x设置为根节点
                    x.parent = null;
                    x.red = false;
                    root = x;
                }
                else {
                    // 否则，当前节点不是根节点
                    K k = x.key;
                    int h = x.hash;
                    Class<?> kc = null;
                    for (TreeNode<K,V> p = root;;) {
                        // 循环比较hash值
                        int dir, ph;
                        K pk = p.key;
                        if ((ph = p.hash) > h)
                            dir = -1;
                        else if (ph < h)
                            dir = 1;
                        else if ((kc == null &&
                                  (kc = comparableClassFor(k)) == null) ||
                                 (dir = compareComparables(kc, k, pk)) == 0)
                            dir = tieBreakOrder(k, pk);

                        TreeNode<K,V> xp = p;
                        // 判断当前节点的hash值，小于放于左树，大于放于右侧节点
                        if ((p = (dir <= 0) ? p.left : p.right) == null) {
                            x.parent = xp;
                            if (dir <= 0)
                                xp.left = x;
                            else
                                xp.right = x;
                            // 进行平衡红黑树
                            root = balanceInsertion(root, x);
                            break;
                        }
                    }
                }
            }
            // 重新移动根节点到头结点
            moveRootToFront(tab, root);
        }
```



### 5. resize扩容

```java
// 需要注意的是： resize扩容会导致所有元素的rehash，放的位置要么是原来的位置，要么是原来位置+旧的数组长度
    // 原位置 + 旧容量
    final Node<K,V>[] resize() {
        // 备份原来的数组
        Node<K,V>[] oldTab = table;
        // 如果当前数组长度为空，那么返回0，否则返回当前数组长度
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        // 获取当前扩容阈值，默认是12（0.75 * 16）,第一次进入时，threshold=0
        int oldThr = threshold;
        // 定义扩容之后的数组长度和扩容阈值
        int newCap, newThr = 0;
        // 分支1
        if (oldCap > 0) {
            // 如果旧的数组不为空，且大于最大元素，那么将当前的扩容大小设置为Integer.Max_value,并且返回当前的数组
            // 因为数组已经不能被扩容了，达到了最大值
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            // 分支1.2 否则，新的数组大小进行扩充为原来的两倍，判断条件，扩容之后的数组需要小于最大容量且原始数组大于初始容量16
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                    oldCap >= DEFAULT_INITIAL_CAPACITY)
                // 阈值也扩大两倍
                newThr = oldThr << 1; // double threshold
        }
        // 分支2 如果原来容量小于等于0, 且原来阈值点大于0，那么将阈值赋值为新的数组长度
        else if (oldThr > 0) // initial capacity was placed in threshold
            newCap = oldThr;
        else {
            // 分支3 都不满足，走这里的默认值
            // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        // 进入下面这个if条件语句有且仅有两种情况：
        // （1）当程序运行到1.2分支语句确没有通过其中的判断时表明：此次扩容为最后一次扩容，扩容之后大小为HashMap最大容量
        // （2）当程序进入2分支时则此次方法调用为给定数值初始化
        // 以上两种情况都未指定新表的扩容阈值，即newThr为初始值0
        if (newThr == 0) {
            float ft = (float)newCap * loadFactor;
            // 如果是1种情况，已经不存在下一次扩容，那么就应该设置Integer.MAX_VALUE
            // 如果是2种情况，那么阈值为新容量*负载因子
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                    (int)ft : Integer.MAX_VALUE);
        }
        // 设置阈值值
        threshold = newThr;
        @SuppressWarnings({"rawtypes","unchecked"})
        // 创建新的数组table
                Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        // 新数组赋值给成员变量table数组
        table = newTab;
        if (oldTab != null) {
            // 原始数组不为空
            for (int j = 0; j < oldCap; ++j) {
                // 循环每一个元素
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    // 取出一个元素，赋值给e，并且将原始元素设置为空
                    oldTab[j] = null;
                    if (e.next == null)
                        // 如果该元素的下一个元素为空，说明就只有一个元素，那么就计算桶位置后直接插入
                        newTab[e.hash & (newCap - 1)] = e;
                        // 下一个元素不为空，说明同一个桶位置还有元素，需要进行红黑树或者链表的处理
                    else if (e instanceof TreeNode)
                        // 如果是红黑树，则调用相关方法把树分开
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else {
                        // 说明是链表，那么需要将原来的链表元素进行重新计算值来放置到不同的位置中
                        // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        // 循环计算新的元素节点位置
                        do {
                            // 原索引
                            next = e.next;
                            // 这里判断true,说明e节点位置不用移动
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                // 原索引+oldCap元素长度
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
                        // 原索引放到bucket中
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        // 原索引+oldCap放到bucket里
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }
```

**为什么(e.hash & oldCap) == 0 就放入原位置？**

使用的是2次幂的扩展即长度扩为原来2倍，所以，元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置。

元素在重新计算hash之后，因为n变为2倍，那么n-1在高位多1bit，因此新的index就会发生这样的变化：

![image-20220211144719655](https://lhf-note.oss-cn-hangzhou.aliyuncs.com/img/image-20220211144719655.png)





### 6.get方法

- 判断当前数组、当前长度，hash之后桶位置是否为空，为空，直接返回null
- 比较获取了桶位置元素是否相等，hashCode,key.equals，相等直接返回，否则获取下一个元素
- 判断元素是否为树节点，是=调用getTreeNode返回
- 否则为链表，使用do-while循环寻找匹配元素返回，寻找不到返回null

```java
    public V get(Object key) {
        Node<K,V> e;
        return (e = getNode(hash(key), key)) == null ? null : e.value;
    }

	/**
     * Implements Map.get and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @return the node, or null if none
     */
    final Node<K,V> getNode(int hash, Object key) {
        Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
        // 判断当前table是否为空，并且桶位置值是否为空，为空直接返回null
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (first = tab[(n - 1) & hash]) != null) {
            // 判断第一个元素是否hash/key相等，相等直接返回
            if (first.hash == hash && // always check first node
                ((k = first.key) == key || (key != null && key.equals(k))))
                return first;
            // 否则，判断下一个元素是否为空，不为空进行链表或者红黑树遍历
            if ((e = first.next) != null) {
                if (first instanceof TreeNode)
                    // 红黑树遍历返回
                    return ((TreeNode<K,V>)first).getTreeNode(hash, key);
                do {
                    // 链表遍历，都无法寻找到，返回null
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        return e;
                } while ((e = e.next) != null);
            }
        }
        return null;
    }

```

### 7. remove方法

```java
 /**
     * Implements Map.remove and related methods
     *
     * @param hash hash for key
     * @param key the key
     * @param value the value to match if matchValue, else ignored
     * @param matchValue if true only remove if value is equal
     * @param movable if false do not move other nodes while removing
     * @return the node, or null if none
     */
    final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
        Node<K,V>[] tab; Node<K,V> p; int n, index;
        // 判断table不为空，并且能在桶中寻找到元素，否则直接返回Null
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (p = tab[index = (n - 1) & hash]) != null) {
            Node<K,V> node = null, e; K k; V v;
            // 判断桶中hash位置元素是否就是当前需要删除的元素
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                // 赋值给node
                node = p;
            // 不是第一个，需要进行链表或者红黑树向下遍历
            else if ((e = p.next) != null) {
                if (p instanceof TreeNode)
                    // 节点为红黑树，需要进行从红黑树中获取node
                    node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
                else {
                    do {
                        // 从链表中获取node
                        if (e.hash == hash &&
                            ((k = e.key) == key ||
                             (key != null && key.equals(k)))) {
                            node = e;
                            break;
                        }
                        p = e;
                    } while ((e = e.next) != null);
                }
            }
            // 判断是否寻找到node节点
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    // 节点为红黑树，调用removeTreeNode移除节点，再平衡红黑树
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    // 当前节点就是第一个节点，那么将当前桶位置设置为null
                    tab[index] = node.next;
                else
                    // 否则为链表结构，直接将上一个节点的next指向当前节点的next节点即可
                    p.next = node.next;
                // modcount修改次数-1，总size长度-1
                ++modCount;
                --size;
                afterNodeRemoval(node);
                // 返回删除了的元素
                return node;
            }
        }
        return null;
    }
```



## 三、经典问题

### 1. HashMap为什么引入红黑树而不是AVL树

首先需要说明的是：引入红黑树是防止多次发生hash冲突，链表元素过长，查询的时间复杂度会变成O(N),同时同一个位置再次发生hash冲突时采用尾插法时间复杂度也是O(N)，使用红黑树可以把查询和插入的时间复杂度降为O(logN);

AVL树是严格平衡树，因此在增加或者删除节点的时候，根据不同情况，旋转的次数比红黑树要多，所以红黑树的插入效率相对于AVL树更高。单单在查找方面比较效率的话，由于AVL高度平衡，因此AVL树的查找效率比红黑树更高。

对主要的几种平衡树作个比较，发现红黑树有着良好的稳定性和完整的功能，性能表现也很不错，综合实力强，在诸如STL的场景中需要稳定表现。实际应用中，若搜索的频率远远大于插入和删除，那么选择AVL，如果发生搜索和插入删除操作的频率差不多，应该选择红黑树。

### 2. 为什么HashMap的大小只能是2次幂

因为只有大小为2次幂时，才能合理用位运算代替取模运算



### 3. HashMap不是线程安全的

在多线程环境下，HashMap可能会存在数据覆盖的情况，在jdk7中，可能会发生死锁问题



### 4. HashMap数据插入问题

jdk8使用尾插法，jdk7使用头插法，所以在多线程扩容的时候，会发生死锁



### 5. Map集合区别

| 类                | 是否线程安全 | 是否有序 | 底层数据结构             | 特征                                          | 不足之处     | key/value  |
| ----------------- | ------------ | -------- | ------------------------ | --------------------------------------------- | ------------ | ---------- |
| HashMap           | 否           | 否       | Node数组+链表+红黑树     |                                               |              | 可以为空   |
| LinkedHashMap     | 否           | 插入有序 | Node数组+双向链表+红黑树 | 每个节点Node增加after,befor指针，实现插入有序 | 乱序，不安全 | 可以为空   |
| TreeMap           | 否           | key有序  | 红黑树                   | 使用红黑树实现基于key的排序                   |              | key不可以  |
| Hashtable         | 是           | 否       | hash数组+拉链法          | 全量使用syncchronized来保证线程安全           | 速度慢       | 不可以     |
| ConcurrentHashMap | 是           | 否       | hash数组+红黑树          | 同步代码块synchronized+CAS                    | 不安全       | 不允许为空 |



### 6. hashMap特征？

- 线程不安全
- 无序
- key只允许一个为空



### 7. HashMap的jdk7和jdk8底层存储区别

jdk7使用数组+链表

jdk8使用数组+链表+红黑树



### 8. HashMap什么时候进行扩容，扩容多大？

扩容时机： 数组元素>数组长度*扩容因子

扩容大小： 原数组的两倍



### 9. ConcurrentHashMap 1.7和1.8区别？

jdk7使用分段锁Segment技术保证线程安全，Segment继承了ReentrantLock类

jdk8使用代码块synchronized+cas保证线程安全



### 10  链表过深为什么不选择二叉查找树，而是用红黑树

二叉查找树会导致一个线性结构，这样跟链表没有区别，使用红黑树会进行自旋平衡



### 11. 为什么HashMap的成都是2的次幂

最直白的来说，就是为了提高效率

取余操作如果除数是2的次幂则等价于除数减一的与操作，也就是hash % length = hash &(length -1),但是前提是length是2的n次幂，并且采用了位运算比%效率高。



### 12. HashMap和HashSet的区别

- HashMap实现Map接口，HashSet实现Set接口
- HashMap是存储键值对，HashSet直接存储元素
- HashSet速度比HashMap更慢



### 13. 为什么JDK8改成了尾插法

使用头插发会改变链表的顺序，使用尾插法，在扩容的时候会保持元素的基本顺序，在多线程下也不会存在链表成环的问题

Java7在多线程操作HashMap时可能引起死循环，原因是扩容转移后前后链表顺序倒置，在转移过程中修改了原来链表中节点的引用关系。

Java8在同样的前提下并不会引起死循环，原因是扩容转移后前后链表顺序不变，保持之前节点的引用关系。



### 14. 为什么负载因子是0.75

在理想情况下，使用随机哈希吗，节点出现的频率在hash桶中遵循**泊松分布**，同时给出了桶中元素的个数和概率的对照表。
从上表可以看出当桶中元素到达8个的时候，概率已经变得非常小，也就是说用0.75作为负载因子，每个碰撞位置的链表长度超过8个是几乎不可能的。
hash容器指定初始容量尽量为2的幂次方。
HashMap负载因子为0.75是空间和时间成本的一种折中

```java
Because TreeNodes are about twice the size of regular nodes, we
     * use them only when bins contain enough nodes to warrant use
     * (see TREEIFY_THRESHOLD). And when they become too small (due to
     * removal or resizing) they are converted back to plain bins.  In
     * usages with well-distributed user hashCodes, tree bins are
     * rarely used.  Ideally, under random hashCodes, the frequency of
     * nodes in bins follows a Poisson distribution
     * (http://en.wikipedia.org/wiki/Poisson_distribution) with a
     * parameter of about 0.5 on average for the default resizing
     * threshold of 0.75, although with a large variance because of
     * resizing granularity. Ignoring variance, the expected
     * occurrences of list size k are (exp(-0.5) * pow(0.5, k) /
     * factorial(k)). The first values are:
     *
     * 0:    0.60653066
     * 1:    0.30326533
     * 2:    0.07581633
     * 3:    0.01263606
     * 4:    0.00157952
     * 5:    0.00015795
     * 6:    0.00001316
     * 7:    0.00000094
     * 8:    0.00000006
     * more: less than 1 in ten million
```

