# JSONHC that can hold classes

*Date オブジェクト を JSON にエンコードした。だけど、JSON デコードしたら 文字列になっていた*

これは別に不思議なことではありません。JSON にすれば Class に関するデータは消えてしまうからです。

そこで JSONHC を提案します。
JSONHC は JSON に準拠して、 Class 名を格納したフォーマットです。


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


jsonhc.encode, jsonhc.decode を使用する方法

```ts
let jsonhc = new jsonhc({  .... });

// decode 
let data = jsonhc.decode( JSON.parse(jsonhcString) )

// encode 
let jsonhcString = JSON.stringify( jsonhc.encode(data) );

```


JSON.parse, JSON.stringify を使用する方法

```ts
let jsonhc = new jsonhc({  .... });

// decode 
let data = JSON.parse(jsonhcString, jsonhc.reviver);

// encode 
let jsonhcString = JSON.stringify(data, jsonhc.replacer);

```



jsonhc.parse, jsonhc.stringify を使用する方法

```ts
let jsonhc = new jsonhc({  .... });

// decode 
let data = jsonhc.parse(jsonhcString);

// encode 
let jsonhcString = jsonhc.stringify(data);

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

JSONHC形式の変数 を JSON 文字列 へ変換します

```ts
parse(value:string) => any
```
| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `string`        | Yes      | JSON文字列                                                   |
| **returns**    | `any`           |          | JSONHC形式の変数                                             |



### stringify

JSONHC形式の変数 を JSON 文字列 へ変換します

```ts
stringify(value:any) => string
```


| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JSONHC形式の変数                                             |
| **returns**    | `string`        |          | JSON文字列                                                   |



### decode

JavaScriptのプレーンな変数からJSONHC形式の変数へデコードする

```ts
decode(value:any) => any
```

| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JavaScriptのプレーンな変数                                   |
| **returns**    | `any`           |          | JSONHC形式の変数                                             |





### encode

JSONHC形式の変数を JavaScriptのプレーンな変数にエンコードする

```ts
encode(value:any) => any
```

| Argument       | Type            | Required | Description                                                  |
| -------------- | --------------- | -------- | ------------------------------------------------------------ |
| `value`        | `any`           | Yes      | JSONHC形式の変数                                             |
| **returns**    | `any`           |          | JavaScriptのプレーンな変数                                   |







## TClassmap

TClassmap は jsonhc 形式のデータと実際の JavaScript のデータとを相互変換するためのテーブルデータです。


コンストラクタでの TClassmap の指定例

```ts
class ClassB extends Persistable {
	public name = 'this is ClassB';
}

let jsonhc = new jsonhc({

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



#### jsonhcSerialize

```ts
jsonhcSerialize() => any;
```

| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| **returns**    | `any`     |          | エンコードした値                                             |




#### jsonhcUnserialize

```ts
jsonhcUnserialize(data:any) => void;
```


| Argument       | Type      | Required | Description                                                  |
| -------------- | --------- | -------- | ------------------------------------------------------------ |
| `data`         | `any`     |          | デコードする値                                               |



デコード処理は、内部で以下のような処理を行っています。

```ts
obj = new MyPersistableClass();
ooj.jsonhcUnserialize(SerializedValue)
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

