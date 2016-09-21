# ImgLazy
a img lazy load script by pure JavaScrip

## Usage

##### html 结构

```html
<ul>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg"  alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
  <li><img src="media/0.png" width="612" height="612" data-src="media/1.jpg" alt="" class="imglazy"></li>
</ul>
```
##### 引入 js

`<script src="imgLazy.js"></script>`

##### js 调用
```js
;(function() {
    // Initialize
    var bLazy = new Blazy();
})()
```

## DEOM

http://dyygtfx.github.io/ImgLazy/demo/index.html