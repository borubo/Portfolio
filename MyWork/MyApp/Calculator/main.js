"use strict"
{
    Vue.component("product", {
        template: `
        <div class="calculator">
            <div class="btn" class="display">{{ current || '0' }}</div>
            <div @click="clear" class="btn">C</div>
            <div @click="sign" class="btn">+/-</div>
            <div @click="percent" class="btn">%</div>
            <div @click="divide" class="btn opretor">÷</div>
            <div @click="append('7')" class="btn">7</div>
            <div @click="append('8')" class="btn">8</div>
            <div @click="append('9')" class="btn">9</div>
            <div @click="times" class="btn opretor">x</div>
            <div @click="append('4')" class="btn">4</div>
            <div @click="append('5')" class="btn">5</div>
            <div @click="append('6')" class="btn">6</div>
            <div @click="minus" class="btn opretor">-</div>
            <div @click="append('1')" class="btn">1</div>
            <div @click="append('2')" class="btn">2</div>
            <div @click="append('3')" class="btn">3</div>
            <div @click="add" class="btn opretor">+</div>
            <div @click="append('0')" class="btn zero">0</div>
            <div @click="dot" class="btn">.</div>
            <div @click="equal" class="btn opretor">=</div>
        </div>
         `,
        data(){
            return {
                previous:null,
                current:'',
                opretor:null,
                opretorClicked:false,
            }
        },
        created() {
            // キーボード入力のイベントをon_keydownメソッドに投げる
            document.onkeydown = () => {
                this.on_keydown(event.keyCode)
            }
        },
        methods:{
            clear(){
                this.current = '';
            },
            sign(){
                this.current = this.current.charAt(0) === '-' ?
                this.current.slice(1) : `-${this.current}`;
            },
            percent(){
                this.current = `${parseFloat(this.current)/100}`
            },
            append(number){
                if(this.opretorClicked){
                    this.current = '';
                    this.opretorClicked = false;
                }
                this.current = `${this.current}${number}`;
            },
            dot(){
                if(this.current.indexOf('.') === -1){
                    this.append('.');
                }
            },
            setPrevious(){
                this.previous = this.current;
                this.opretorClicked = true;
            },
            divide(){
                this.opretor = (a,b) => a/b;
                this.setPrevious();
            },
            times(){
                this.opretor = (a,b) => a*b;
                this.setPrevious();
            },
            minus(){
                this.opretor = (a,b) => a-b;
                this.setPrevious();
            },
            add(){
                this.opretor = (a,b) => a+b;
                this.setPrevious();
            },
            equal(){
                this.current = `${this.opretor(
                    parseFloat(this.current),
                    parseFloat(this.previous)
                    )}`;
                    this.previous = null;
            },
                    // キー入力を受け取る
        on_keydown(keyCode) {
            switch(keyCode) {
                case 48:this.append(0)
                    break
                case 49:this.append(1)
                    break
                case 50:this.append(2)    
                    break
                case 51:this.append(3)    
                    break
                case 52:this.append(4)    
                    break
                case 53:this.append(5)    
                    break
                case 54:this.append(6)    
                    break
                case 55:this.append(7)    
                    break
                case 56:this.append(8)    
                    break
                case 57:this.append(9)    
                    break
                case 58:this.append(10)    
                    break
                case 186:this.add()
                // console.log("add")
                    break
                case 189:this.minus()
                // console.log("minus")
                    break
                case 222:this.times()
                // console.log("time")
                    break
                case 191:this.divide()
                // console.log("divide")
                    break
                case 32:this.equal()
                // console.log("equal")
                    break
                case 8:this.clear()
                // console.log("clear")
                    break
            }
        },
        }
      });

    new Vue({
        el: '#app',
    })
}