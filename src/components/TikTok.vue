<template>

 <div>
    <v-card class="box" hover>
      <v-layout row wrap justify-center>
        <img src="@/assets/tt.png" style="margin-right: 20px; margin-top: 9px;" width="40" height="40">
        <v-flex xs8 md8 lg8>
          <v-text-field color="#69C9D0" v-on:keyup.enter="getTiktok" value label="TikTok URL" v-model="ttURL" clearable></v-text-field>
        </v-flex>
        <v-btn @click="getTiktok" outline dark large color="#69C9D0">
            <v-icon dark>search</v-icon>
        </v-btn>
      </v-layout>

      <v-flex xs12 md12 lg12>
        <v-progress-linear color="#69C9D0" :active="isTT" :indeterminate="true"></v-progress-linear>
      </v-flex>
      <h3 class="text-md-center">
        <v-chip label outline color="#69C9D0">
          <h3>{{ttComm}}</h3>
        </v-chip> in comments
      </h3>
       <v-data-table :headers="headers" :items="nums" hide-actions>
        <template slot="items" slot-scope="props">
            <td class="text-xs">{{ props.item.one }}</td>
            <td class="text-xs">{{ props.item.two }}</td>
            <td class="text-xs">{{ props.item.three }}</td>
            <td class="text-xs">{{ props.item.four }}</td>
        </template>
        </v-data-table>
    </v-card>

  <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title class="headline">TikTok captcha</v-card-title>
        <v-layout wrap row>
          <img style="margin-left: 50px;" id = "image" height="100" width="250">
          <v-text-field v-on:keyup.enter="captchaEnter" style="margin-left: 50px; margin-right: 50px;" value label="TikTok captcha" v-model="captcha" clearable></v-text-field>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="#69C9D0" @click="captchaEnter" @keyup.enter="captchaEnter"> Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>  
</div>

</template>

<script>
import { eventBus } from '../main';

export default {
  data: () => ({

    headers: [
          { text: '1', sortable: false, align: 'center'},
          { text: '2', sortable: false, align: 'center'},
          { text: '3' , sortable: false, align: 'center'},
          { text: '4', sortable: false, align: 'center'},
        ],
    nums: [
      {
      one: 0,
      two: 0,
      three: 0,
      four: 0,
    }
    ],
    numsEmpty: [ { one: 0,two: 0, three: 0, four: 0, }],

    ttURL: "",
    ttComm: 0,
    isTT: false,
    dialog: false,
    captcha: "",
    isDone: true,
  }),

computed: {
  example: {
    cache: false,
    get: function () {
      return Date.now() + this.msg
    }
  }
},
  methods: {   
    captchaEnter: function(){
      this.getTiktok(this.captcha);
      this.dialog = false;
    },

    async getTiktok(_captcha) {
      if(this.isDone){
        this.isDone = false;
        this.ttComm = 0;

        // Kostyl, call from search button
        if(typeof(_captcha)== "object"){
          _captcha=""
          this.captcha = ""
        }

        this.isErr = false;
        this.isTT = true;
        try {    
          let answer = await this.makeReqTikt({ site:"tiktok", 
          url: this.ttURL, captcha: _captcha});
          /* eslint-disable no-console */
          if (answer.captcha == "image"){
            this.dialog = true;
            //console.log("Answer: "+ answer)
            let img = document.getElementById("image");
            img.src = this.$hostname+"captcha/cp.png?dummy="+ Math.random(0, 1000)
          } else {
              eventBus.$emit('ttResult', answer.ones-this.nums[0].one,
                                         answer.twos-this.nums[0].two,
                                         answer.threes-this.nums[0].three,
                                         answer.fours-this.nums[0].four)

              this.ttComm = answer.comments;
              this.nums[0].one = answer.ones;
              this.nums[0].two = answer.twos;
              this.nums[0].three = answer.threes;
              this.nums[0].four = answer.fours;
              eventBus.$emit('successAlert', "TikTok parsing finished")
          }
        } catch (error) {
          /* eslint-disable no-console */
          console.log(`getTiktok got error`, error);
          eventBus.$emit('errorAlert', "Tiktok request failed");
          eventBus.$emit('ttResult', 0-this.nums[0].one,
                                     0-this.nums[0].two,
                                     0-this.nums[0].three,
                                     0-this.nums[0].four)
          this.nums[0].one = 0;
          this.nums[0].two = 0;
          this.nums[0].three = 0;
          this.nums[0].four = 0;
          this.isErr = true;
          this.ttComm = 0;
          this.nums = this.numsEmpty;
        } finally {
          this.isTT = false;
          this.captcha = ""
        }

        this.isDone = true;
      }
    },

    makeReqTikt({ site, url, captcha }) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$hostname + `${site}`, {
            params: { url: url, captcha: captcha}
          })
          .then(response => {
            /* eslint-disable no-console */
            console.log(`makeReqTikt`, response);
            return resolve(response.body);
          })
          .catch(err => {
            console.log(`makeReqTikt got err`, err);
            return reject(err);
          });
      });
    }
  }
};
</script>

<style>
.box{
  padding-top:30px;
  padding-left:10px;
  padding-right:10px;
  margin-bottom: 50px;
}
</style>
