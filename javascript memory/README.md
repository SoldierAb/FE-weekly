# 🔥 Javascript 内存管理：如何避免内存溢出和性能优化技巧

本文将带大家了解Javascript的内存管理机制及性能优化技巧

涉及以下内容：
- 介绍
- 理解JS的内存管理
    - 垃圾回收
    - 堆和栈
- 常见内存泄漏
    - 循环引用
    - 事件
    - 全局变量
- 内存管理最佳实践
    - 弱引用的使用
    - 使用垃圾回收器的全局API
    - heap snapshots & profilers



# 前言介绍

作为Web开发人员都清楚我们编写的每一行代码都会影响应用程序的性能。而对于JavaScript，最值得关注的领域之一就是内存管理。

🤔思考一下，每当用户与网站进行交互时，他们都会创建新的对象，变量和功能。而且，如果代码不规范，这些对象会堆积起来，堵塞浏览器的内存并直接影响用户的整体体验。这就像信息高速公路中春节回家的交通拥堵 —— 这是一个令人头疼甚至劝退用户的问题

但这不必这样。借助正确的知识和技术，我们可以很好地控制JavaScript内存，并确保应用程序顺畅、有效地运行。在本文中，我们将探讨JavaScript内存管理的来龙去脉，包括内存泄漏的常见原因以及避免它们的策略。无论你是专业人士还是新手，将都会对如何快速编写 简单、性能更好 的代码有更深入的了解。


# JavaScript 内存管理

## Garbage Collector 

JavaScript引擎使用垃圾收集器来释放不再使用的内存。垃圾收集器的工作是识别和删除应用程序不再使用的对象。它通过不断监视代码中的对象和变量，跟踪存在引用的对象和变量来实现此目的。一旦不再使用对象，垃圾收集器就会标记删除并释放其使用的内存。

垃圾收集器使用一种称为“Mark and Sweep”的技术来管理内存。它首先要标记所有仍在使用的对象，然后通过堆“扫掠”，删除任何未标记的对象。此过程是定期完成的，以确保应用程序的内存使用始终尽可能高效。

## Stack & Heap

当涉及JavaScript中的内存时，有两个主要角色：栈 Stack 和 堆 Heap。

Stack用于存储仅在函数执行过程中需要的数据。快速有效，但容量也有限。当调用函数时，JavaScript引擎将函数的变量和参数推到Stack上，当功能返回时，它将再次弹出它们。简言之，Stack用于快速访问和快速内存管理。

而堆Heap用于存储整个应用程序一生所需的数据。它比Stack慢一点，井井有条，但容量要大得多。Heap用于存储需要多次访问的对象，数组和其他复杂数据结构


# 内存泄漏

内存泄漏可能是一个程序代码中的COVID-19，蔓延到应用程序中并引起性能问题。通过了解内存泄漏的常见原因，我们就可以用知识来武装自己👨🏻‍💻

## 循环引用

导致内存泄漏最常见原因之一是循环引用。当两个或多个对象相互引用时，就会发生——导致垃圾收集器无法正常回收，会导致对象在不再需要后的很长时间里仍存在于内存中

```js
let object1 = {};
let object2 = {};

// 循环引用创建
object1.next = object2;
object2.prev = object1;

// do something with object1 and object2
// ...

// 置为null来解除循环引用？？？
object1 = null;
object2 = null;
```

在此示例中，我们创建了两个对象，即object1和object2，并通过向其添加next和prev属性来构建它们之间的循环引用。然后，我们将Object1和Object2设置为null想打破循环引用，但是由于prev和next设置的原因垃圾收集器无法正常运作，因此在它们不再需要后的很长时间里，对象将保存在内存中，从而导致内存泄漏。

为了避免这种类型的内存泄漏， 我们可以这样做：
```js
delete object1.next;
delete object2.prev;
```

避免这种内存泄漏的另一种方法是使用WeakMap和WeekSet——它们允许我们可以创建对 对象和变量的弱引用。 下文将会讲解如何操作。


## 事件监听

另一个常见原因是不合理的事件侦听器。当我们将事件侦听器附加到元素时，它会创建对侦听器函数的引用，该函数可以阻止垃圾收集器释放元素使用的内存。如果该事件监听器没有被合理释放，则可能会导致内存泄漏

```js
let button = document.getElementById("my-button");

// 添加点击事件
button.addEventListener("click", function() {
  console.log("Button was clicked!");
});

// do something with the button
// ...

// 移除DOM节点
button.parentNode.removeChild(button);

```

在此示例中，我们将事件侦听器附加到button元素，然后从DOM中删除按钮。即使button不再在Html中，事件侦听器Event Listener仍然存在，它仍保留着对侦听器函数的引用，它会阻止垃圾收集器释放它所使用的内存。如果合理移除，则可能会导致内存泄漏

为了避免这种类型的内存泄漏，重要的是在不再需要元素时删除事件侦听器

```js
button.removeEventListener("click", function() {
  console.log("Button was clicked!");
});
```

⚠️ 另一种方法是使用EventTarget.RemoveAlllisteners（）方法，该方法删除已添加到特定事件目标的所有事件侦听器
```js
button.removeAllListeners();
```

## 全局变量

内存泄漏的第三个常见原因是全局变量。当创建一个全局变量时，它可以从代码中的任何地方访问，这会导致难以确定它们何时不再需要

```js
// 全局变量创建
let myData = {
  largeArray: new Array(1000000).fill("some data"),
  id: 1
};

// do something with myData
// ...

myData = null;

```

在此示例中，我们正在创建一个全局变量mydata并在其中存储大量数据。然后，我们将mydata设置为null来解除引用，但是由于它是全局变量，任何地方都有可能引用它，这就导致我们很难直接删除它，myData就会一直存在于内存中，导致内存泄漏。

为了避免这种类型的内存泄漏，我们可以使用函数作用域“Function Scope”技巧。在该函数内部创建和声明变量，以便它们仅在函数范围内访问。这样，当不再需要函数时，变量会自动收集。

```js
function myFunction() {
  let myData = {
    largeArray: new Array(1000000).fill("some data"),
    id: 1
  };

  // do something with myData
  // ...
}
myFunction();

```

另一种方法是使用JavaScript的let、const而不是var，它们将创建会级作用域变量。使用let、const声明的变量只能在其定义的块中访问，并且将自动收集垃圾。

```js
{
  let myData = {
    largeArray: new Array(1000000).fill("some data"),
    id: 1
  };

  // do something with myData
  // ...
}

```

# 内存管理最佳实践

JavaScript提供内存管理工具和技术，可以帮助检查应用程序的内存使用量

## 1.弱引用的使用

JavaScript中最强大的内存管理工具之一是`WeakMap`和`WeakSet`。它们可以创建对对象和变量的弱引用。弱引用与常规引用不同，因为它们不会阻塞垃圾收集器释放对象使用的内存。这使它们成为避免 循环引用引起的内存泄漏的好工具。

```js
let object1 = {};
let object2 = {};

// 创建weakMap
let weakMap = new WeakMap();

// 循环引用创建
weakMap.set(object1, "some data");
object1.weakMap = weakMap;

//创建weakSet
let weakSet = new WeakSet();
weakSet.add(object2);

```

在此示例中，我们创建了两个对象，即object1和object2，并通过分别将它们添加到`WeakMap`和`WeakSet`中来构建它们之间的循环引用。由于对这些对象是弱引用，因此即使仍在引用它们，垃圾收集器也能够释放它们使用的内存。这可以帮助防止循环引用引起的内存泄漏



## 2.使用垃圾回收器的全局API

另一种内存管理技术是使用垃圾收集器API，它允许我们可以手动触发垃圾收集并获取有关堆当前状态的信息。这对于调试内存泄漏和性能问题可能很有用

```js
let object1 = {};
let object2 = {};

object1.next = object2;
object2.prev = object1;

// 手动调用
gc();
```


在此示例中，我们创建了两个对象，即object1和object2，并通过向其添加下一步和预先属性来创建它们之间的循环引用。然后，我们使用`gc()`函数来手动触发垃圾收集，即使仍在引用对象，该函数也将释放对象使用的内存。

一定要注意的是，不是所有JavaScript引擎都支持`gc()`功能，该行为因引擎而异。同样要注意的是，手动触发垃圾收集可能会对性能产生影响，因此建议仅在必要时谨慎使用它。

除`gc()`函数外，JavaScript还为某些JavaScript引擎提供了global.gc（）和global.gc（）函数，以及某些浏览器引擎的性能。gc.gc（），可用于检查堆的当前状态并测试垃圾收集过程的性能


## 3. heap snapshots & profilers

JavaScript还提供了 `heap snapshots`和`profilers`，可以帮助我们了解应用程序的使用方式。

### heap snapshots

`heap snapshots`使您可以拍摄堆当前状态的快照，并分析它以查看哪些对象使用最多的内存。

我们来看下示例，如何使用堆快照来识别应用程序中的内存泄漏
```js
// 创建 heap snapshots
let snapshot1 = performance.heapSnapshot();

// 可以是任何可能引起内存泄漏的代码，以下只给出简单的示例
for (let i = 0; i < 100000; i++) {
  myArray.push({
    largeData: new Array(1000000).fill("some data"), 
    id: i
  });
}

// 创建另外一个 snapshot
let snapshot2 = performance.heapSnapshot();

// 对比
let diff = snapshot2.compare(snapshot1);

// 分析哪个快照使用内存较多
diff.forEach(function(item) {
  if (item.size > 1000000) {
    console.log(item.name);
  }
});

```

在此示例中，我们在 执行一个将数据推入数组的循环之前 和之后 拍摄两个`heap snapshot`快照，然后比较两个快照以识别循环中创建的对象。然后，我们可以分析差异以查看哪些对象使用更多的内存，这可以帮助我们识别哪个地方引起的内存泄漏。

### Profiler

`Profiler`则会跟踪应用程序的性能并确定内存使用量高的领域

```js
let profiler = new Profiler();

profiler.start();

// 可以是任何可能引起内存泄漏的代码，以下只给出简单的示例
for (let i = 0; i < 100000; i++) {
  myArray.push({
    largeData: new Array(1000000).fill("some data"), 
    id: i
  });
}

profiler.stop();

let report = profiler.report();

// 分析差异以查看哪些使用更多的内存
for (let func of report) {
  if (func.memory > 1000000) {
    console.log(func.name);
  }
}

```

在此示例中，我们使用`JavaScript Profiler`启动和停止跟踪应用程序的性能。该报告将显示有关所调用功能的信息以及每个功能的内存使用量。


‼️ 重要：不是所有JavaScript引擎和浏览器都支持`heap snapshots & profilers`，因此在应用程序中使用它们之前，请先检查兼容性


# 总结

本文介绍了JavaScript内存管理的基础知识，包括垃圾收集过程，不同类型的内存以及JavaScript中可用的内存管理工具和技术。我们还讨论了记忆泄漏的常见原因，并提供了如何避免它们的示例。

希望通过本文，大家对JavaScript内存相关有更深的认识，点个赞吧～。
































