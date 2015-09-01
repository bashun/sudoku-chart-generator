/*
makeChart
長さ８１の数独の配列を返します。
*/

// 配列作成メイン
function makeChart(){
  // 長さ８１の配列を作成する。
  var sudokuChart = new Array(81);

  // 長さ９の１−９がランダムに並んだ配列を作成する。
  var randomArray = makeRandomArray();
  var randomNum;
  var checkDeadLock = 0;

  // 入力用配列から取得した値がi番目に入力可能かチェックする
  for(var i = 0; i < sudokuChart.length; i++){

    // ループが300回以上続く場合は、初期化し最初から実行する。
    if(checkDeadLock > 300){
      sudokuChart = new Array(81);
      i = 0;
      randomArray = makeRandomArray();
      checkDeadLock = 0;
    }

    // 番兵を設定
    over = true;
    // 入力用配列が空の場合は作成する
    if(randomArray.length === 0){
      randomArray = makeRandomArray();
    }

    // 入力用配列から値を取得しチェックを行う
    for(var count = 0; count < randomArray.length; count++){

      randomNum = randomArray.shift();

      // チェック窓口関数を呼び出し、trueの場合はi番目に値を入力し、番兵をfalseにする
      // falseの場合は、取得した値を配列に戻し次の値を取得する。
      if(check(sudokuChart,randomNum,i)){
        sudokuChart[i] = randomNum;
        over = false;
        break;
      }else{
        randomArray.push(randomNum);
      }

    }

    // どの値も入力できなかった場合、行の先頭からやり直す
    if(over){
      // 現在の位置から行の先頭までの入力された値をundefinedに置き換える
      sudokuChart = partClear(sudokuChart,i - parseInt(i%9),i)
      // iを行の先頭に変更
      i = i - parseInt(i%9) - 1;
      // 入力用配列を再作成
      randomArray = shuffle(makeArray(9));
    }

    checkDeadLock++;
  }

  return sudokuChart;
}

// facade check function
function check(sudokuChart,tagNum,index){
  if(checkColumnDuplicate(sudokuChart,tagNum,index) &&
  checkBlockDuplicate(sudokuChart,tagNum,index)){
    return true;
  }else{
    return false;
  }
}

// 1から9で埋めた配列を返す
function makeArray(length){
  var chart = new Array(length);

  // 1-9の値で配列を初期化する
  for(var i = 0; i < length; i++){
    chart[i] = i % 9 + 1;
  }

  return chart;
}

// 配列をランダムに並び替える
function shuffle(array){

  // 行ごとにランダムなkeyと入れ替える
  for(var i = 0;i<array.length;i++){
    // 行数を判定(i/9==1なら2行目）しkey値を算出する
    var firstNum = parseInt(i / 9) * 9 + getRandomInt();
    var secondNum = parseInt(i / 9) * 9 + getRandomInt();

    // 配列の中身を入れ替える
    var tmp = array[firstNum];
    array[firstNum] = array[secondNum];
    array[secondNum] = tmp;
  }

  return array
}

// 自身が所属する列で値が重複していないかチェックする
function checkColumnDuplicate(sudokuChart,tagNum,index){

  // 配列フィルタ用オブジェクト
  var obj = {};
  obj.tagIndex = index;

  // 数独配列から同じ列の要素をフィルタリングし比較用配列を作成する
  var compareArray = sudokuChart.filter(colFilter,obj);

  // 比較結果を返す。
  return notExistCheck(tagNum, compareArray);
}

// 自身が所属するブロックで値が重複していないかチェックする
function checkBlockDuplicate(sudokuChart,tagNum,index){

  // 配列フィルタ用オブジェクト
  var obj = {}
  obj.tagIndex = index;

  // 数独配列から同じ列の要素をフィルタリングし比較用配列を作成する
  var compareArray = sudokuChart.filter(blockFilter,obj);

  // 同じ値が3×3の領域に存在しないか確認し、存在する場合はi+1番目の値と比較する
  return notExistCheck(tagNum, compareArray);
}


// tagNumがtagArrayに含まれていない場合true。含まれている場合、falseを返す。
function notExistCheck(tagNum, tagArray){
  for(var i = 0; i<tagArray.length; i++){
    if(tagNum === tagArray[i]){
      return false;
    }
  }
  return true;
}

// 引数を９で割った余りを３で割った値を返す
function calCol(x){
  return parseInt(parseInt(x%9)/3);
}

// 引数を９で割った商を３で割った値を返す
function calRow(x){
  return parseInt(parseInt(x/9)/3);
}

function getRandomInt(){ // 0-8までの整数をランダムに返す
  var randomInt = Math.floor(Math.random() * 9);
  return randomInt;
}

// デバッグ用配列表示関数
function showArray(array){
  var showArray = [];
  for(var i = 0; i < array.length; i++){
    showArray.push(array[i]);

    if(parseInt(i%9) === 8){
      console.log(showArray);
      showArray = [];
    }
  }
}

// 列filter関数
function colFilter(value,index){
  if(parseInt(index % 9) === parseInt(this.tagIndex % 9)){
    return true;
  }
}

// ブロックフィルタ関数
function blockFilter(value,index){
  if(calCol(index) === calCol(this.tagIndex)
   && calRow(index) === calRow(this.tagIndex)){
    return true;
  }
}

// 配列部分初期化関数
function partClear(array,a,b){
  for(var i = a; a < b; a++){
    array[a] = undefined;
  }
  return array;
}

// １から９のランダムな値が入力された配列を作成する
function makeRandomArray(){
  var array = makeArray(9);
  array = shuffle(array);

  return array;
}

module.exports = {
  makeChart : makeChart,
  show : showArray
}
