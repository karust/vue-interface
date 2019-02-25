<template>
  <v-container>
    <v-layout text-xs-center row wrap>
      
    <v-flex xs12 md6 offset-xs3>
      <v-alert
      :value="isErr"
      color="warning"
      icon="priority_high"
      outline
      >
      Wrong request
      </v-alert>
    </v-flex>

  <div class="padding"></div>

  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
      <v-layout row wrap>
        <v-text-field v-on:keyup.enter="getYoutube" value label="YouTube URL" v-model="ytURL" clearable ></v-text-field>
        <v-btn @click="getYoutube" outline dark large color="red">
            <v-icon dark>search</v-icon>
        </v-btn>
      </v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear color="red" :active="isYT" :indeterminate="true"></v-progress-linear>
      </v-flex> 
      <h3 class="text-md-center">
        <v-chip label outline color="red">
          <h3>{{ytComm}}</h3>
        </v-chip> in comments
        <v-chip label outline color="red">
          <h3>{{ytRepl}}</h3>
        </v-chip> in replies
      </h3> 

      <v-data-table :headers="headers" :items="nums" class="elevation-1" hide-actions>
        <template slot="items" slot-scope="props">
          <td class="text-xs">{{ props.item.one }}</td>
          <td class="text-xs">{{ props.item.two }}</td>
          <td class="text-xs">{{ props.item.three }}</td>
          <td class="text-xs">{{ props.item.four }}</td>
        </template>
      </v-data-table>
    </v-card>
  </v-flex>


  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
    <v-layout row wrap>
      <v-text-field v-on:keyup.enter="getInstagram" value label="Instagram URL" v-model="instURL" clearable></v-text-field>
      <v-btn @click="getInstagram" outline dark large color="orange">
            <v-icon dark>search</v-icon>
        </v-btn>
    </v-layout>
    <v-flex xs6 md6 offset-xs3>
      <v-progress-linear color="orange" :active="isIN" :indeterminate="true"></v-progress-linear>
    </v-flex>  
    <h3 class="text-md-center">
      <v-chip label outline color="orange">
        <h3>{{instComm}}</h3>
      </v-chip> in commnets
    </h3>
    </v-card>
  </v-flex>

  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
      <v-layout row wrap>
        <v-text-field v-on:keyup.enter="getTiktok" value label="TikTok URL" v-model="ttURL" clearable></v-text-field>
        <v-btn @click="getTiktok" outline dark large color="blue-grey">
                <v-icon dark>search</v-icon>
            </v-btn>
      </v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear :active="isTT" :indeterminate="true"></v-progress-linear>
      </v-flex>
      <h3 class="text-md-center">
        <v-chip label outline color="blue-grey">
          <h3>{{ttComm}}</h3>
        </v-chip> in comments
      </h3>
    </v-card>
  </v-flex>


  <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title class="headline">TikTok captcha</v-card-title>
        <v-layout wrap row>
          <img style="margin-left: 50px;" id = "image" height="100" width="250">
          <v-text-field v-on:keyup.enter="captchaEnter" style="margin-left: 50px; margin-right: 50px;" value label="TikTok captcha" v-model="captcha" clearable></v-text-field>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-grey" @click="captchaEnter" @keyup.enter="captchaEnter"> Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
      <v-layout row wrap>
        <v-text-field v-on:keyup.enter="getFacebook" value label="Facebook URL" v-model="fbURL" clearable></v-text-field>
        <v-btn @click="getFacebook" outline dark large color="indigo">
                <v-icon dark>search</v-icon>
            </v-btn>
      </v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear :active="isFB" :indeterminate="true"></v-progress-linear>
      </v-flex>
      <h3 class="text-md-center">
        <v-chip label outline color="indigo">
          <h3>{{fbComm}}</h3>
        </v-chip> in comments
        <v-chip label outline color="indigo">
          <h3>{{fbRepl}}</h3>
        </v-chip> in replies
      </h3>
    </v-card>
  </v-flex>  

    </v-layout>
  </v-container>
</template>

<script>
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

    ytURL: "",
    instURL: "",
    ttURL: "",
    fbURL: "",

    ytComm: 0,
    instComm: 0,
    ttComm: 0,
    fbComm: 0,

    ytRepl: 0,
    fbRepl: 0,

    isYT: false,
    isIN: false,
    isTT: false,
    isFB: false,
    isErr: false,

    dialog: false,
    captcha: "",
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

     async getFacebook() {
      this.isErr = false;
      this.isFB = true;
      this.fbComm = 0;
      this.fbRepl = 0;
      try {
        let answer = await this.makeReq({ site:"facebook", url: this.fbURL });
        /* eslint-disable no-console */
        console.log(`getFacebook got result`, answer);
        this.fbComm = answer.comments_count;
        this.fbRepl = answer.subcomments_count;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getFacebook got error`, error);
        this.isErr = true;
      } finally {
        this.isFB = false;
      }
    },

    async getYoutube() {
      this.isErr = false;
      this.isYT = true;
      this.ytComm = 0;
      this.ytRepl = 0;
      try {
        let answer = await this.makeReq({ site:"youtube", url: this.ytURL });
        /* eslint-disable no-console */
        console.log(`getYoutube got result`, answer);
        this.ytComm = answer.comments_count;
        this.ytRepl = answer.subcomments_count;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getYoutube got error`, error);
        this.isErr = true;
        this.ytComm = 0;
        this.ytRepl = 0;
      } finally {
        this.isYT = false;
      }
    },

    async getInstagram() {
      this.isErr = false;
      this.isIN = true;
      this.instComm = 0;
      try {
        let answer = await this.makeReq({ site:"instagram", url: this.instURL });
        /* eslint-disable no-console */
        console.log(`getInstagram got result`, answer);
        this.instComm = answer.comments_count;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getInstagram got error`, error);
        this.isErr = true;
        this.instComm = 0;
      } finally {
        this.isIN = false;
      }
    },
    
    captchaEnter: function(){
      this.getTiktok(this.captcha);
      this.dialog = false;
    },

    async getTiktok(_captcha) {
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
            this.ttComm = answer.comments_count;
        }
     
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getTiktok got error`, error);
        this.isErr = true;
        this.ttComm = 0;
      } finally {
        this.isTT = false;
        this.captcha = ""
      }
    },

    makeReq({ site, url }) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(this.$hostname + `${site}`, {
            params: { url: url }
          })
          .then(response => {
            /* eslint-disable no-console */
            console.log(`makeReq`, response);
            return resolve(response.body);
          })
          .catch(err => {
            console.log(`makeReq got err`, err);
            return reject(err);
          });
      });
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
.padding {
  height: 50px;
}
.box{
  padding-top:30px;
  padding-left:10px;
  padding-right:10px;
  margin-bottom: 50px;
}
</style>
