# JSONC : JSON with class

*Date オブジェクト を JSON にエンコードした。だけど、JSON デコードしたら 文字列になっていた*

これは別に不思議なことではありません。JSON にすれば Class に関するデータは消えてしまうからです。

そこで JSONC を提案します。
JSONC は JSON に準拠して、 Class 名を格納したフォーマットです。


```ts
{
    "type": "MyClass",
    "apple": "pie",
    "orange": "cake"
}
```

大きな特徴は `'type': 'MyClass'` のようにクラスの情報を格納します。
これにより、エンコード・デコードしたときに適切にクラスを復元できるようになります。


## 使用例


jsonc.encode, jsonc.decode を使用する方法

```ts
let jsonc = new Jsonc({  .... });

// decode 
let data = jsonc.decode( JSON.parse(jsoncString) )

// encode 
let jsoncString = JSON.stringify( jsonc.encode(data) );

```


JSON.parse, JSON.stringify を使用する方法

```ts
let jsonc = new Jsonc({  .... });

// decode 
let data = JSON.parse(jsoncString, jsonc.reviver);

// encode 
let jsoncString = JSON.stringify(data, jsonc.replacer);

```



jsonc.parse, jsonc.stringify を使用する方法

```ts
let jsonc = new Jsonc({  .... });

// decode 
let data = jsonc.parse(jsoncString);

// encode 
let jsoncString = jsonc.stringify(data);

```




## API


### constuctor


```ts
constructor(classmap : TClassmap = {})
```

| Argument       | Type        | Required | Description                                                  |
| -------------- | ----------- | -------- | ------------------------------------------------------------ |
| `classmap`     | `TClassmap` |          | クラスの相互変換テーブル                                     |



### reviver

JSON.parse() の reviver として使用できます

```ts
reviver(key:null|string, value:any) => any
```
| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `key`          | `null`|`string` | Yes      |                                                              |
| `value`        | `any`           | Yes      |                                                              |
| **returns**    | `any`           |          |                                                              |




### replacer

JSON.stringify() の replacer として使用できます

```ts
replacer(key:null|string, value:any) => any
```
| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `key`          | `null`|`string` | Yes      |                                                              |
| `value`        | `any`           | Yes      |                                                              |
| **returns**    | `any`           |          |                                                              |



### parse

JSONC形式の変数 を JSON 文字列 へ変換します

```ts
parse(value:string) => any
```
| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `string`        | Yes      | JSON文字列                                                   |
| **returns**    | `any`           |          | JSONC形式の変数                                              |



### stringify

JSONC形式の変数 を JSON 文字列 へ変換します

```ts
stringify(value:any) => string
```


| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JSONC形式の変数                                              |
| **returns**    | `string`        |          | JSON文字列                                                   |



### decode

JavaScriptのプレーンな変数からJSONC形式の変数へデコードする

```ts
decode(value:any) => any
```

| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JavaScriptのプレーンな変数                                   |
| **returns**    | `any`           |          | JSONC形式の変数                                              |





### encode

JSONC形式の変数を JavaScriptのプレーンな変数にエンコードする

```ts
encode(value:any) => any
```

| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JSONC形式の変数                                              |
| **returns**    | `any`           |          | JavaScriptのプレーンな変数                                   |







## TClassmap

TClassmap は jsonc 形式のデータと実際の JavaScript のデータとを相互変換するためのテーブルデータです。


コンストラクタでの TClassmap の指定例

```ts
class ClassB extends Persistable {
	public name = 'this is ClassB';
}

let jsonc = new Jsonc({

	// TResolver 方式
	'classA' : {
		test: ClassA,
		serialize: (data:any)=>{
			return _.toPlainObject(data);
		},
		unserialize: (data:any)=>{
			let obj = new ClassA();
			for(let [k, v] of Object.entries(data) ){
				(obj as any)[k] = v;
			}
			return obj;
		},
	},

	// IPersistable 方式
	'classB' : ClassB,
});
```

### IPersistable

IPersistable インタフェースには 次のメソッドを備える必要があります。



#### jsoncSerialize

```ts
jsoncSerialize() => any;
```

| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| **returns**    | `any`     |          | エンコードした値                                             |




#### jsoncUnserialize

```ts
jsoncUnserialize(data:any) => void;
```


| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| `data`         | `any`     |          | デコードする値                                               |



デコード処理は、内部で以下のような処理を行っています。

```ts
obj = new MyPersistableClass();
ooj.jsoncUnserialize(SerializedValue)
```



### TResolver


TResolver は、`test` メソッド や `serialize` メソッド 、 `unserialize` メソッド を含むオブジェクトです。 



#### test

エンコードできるかどうか判別する。

```ts
test(data:any) => boolean;
```


| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| `data`         | `any`     |          | エンコードする値                                             |
| **returns**    | `any`     |          | エンコードできるなら `true` できないなら `false` を返します  |





#### serialize

```ts
serialize(data:any) => any;
```


| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| `data`         | `any`     |          | エンコードする値                                             |
| **returns**    | `any`     |          | エンコードした値                                             |




#### serialize

```ts
unserialize(data:any) => any;
```


| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| `data`         | `any`     |          | デコードする値                                               |
| **returns**    | `any`     |          | デコードした値                                               |

