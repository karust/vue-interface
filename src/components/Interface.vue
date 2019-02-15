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
        <v-text-field v-on:keyup.enter="getYoutube" value label="YouTube URL" v-model="youtubeUrl" clearable ></v-text-field>
        <v-btn @click="getYoutube" outline dark large color="red">
            <v-icon dark>search</v-icon>
        </v-btn>
      </v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear color="red" :active="isYT" :indeterminate="true"></v-progress-linear>
      </v-flex> 
      <h3 class="text-md-center">
        <v-chip label outline color="red">
          <h3>{{youtubeNum}}</h3>
        </v-chip> encounters
      </h3>   
    </v-card>
  </v-flex>


  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
    <v-layout row wrap>
      <v-text-field v-on:keyup.enter="getInstagram" value label="Instagram URL" v-model="instagramUrl" clearable></v-text-field>
      <v-btn @click="getInstagram" outline dark large color="orange">
            <v-icon dark>search</v-icon>
        </v-btn>
    </v-layout>
    <v-flex xs6 md6 offset-xs3>
      <v-progress-linear color="orange" :active="isIN" :indeterminate="true"></v-progress-linear>
    </v-flex>  
    <h3 class="text-md-center">
      <v-chip label outline color="orange">
        <h3>{{instagramNum}}</h3>
      </v-chip> encounters
    </h3>
    </v-card>
  </v-flex>

  <v-flex xs12 md6 offset-xs3>
    <v-card class="box">
      <v-layout row wrap>
        <v-text-field v-on:keyup.enter="getTiktok" value label="TikTok URL" v-model="tiktokUrl" clearable></v-text-field>
        <v-btn @click="getTiktok" outline dark large color="primary">
                <v-icon dark>search</v-icon>
            </v-btn>
      </v-layout>
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear :active="isTT" :indeterminate="true"></v-progress-linear>
      </v-flex>
      <h3 class="text-md-center">
        <v-chip label outline color="primary">
          <h3>{{tiktokNum}}</h3>
        </v-chip> encounters
      </h3>
    </v-card>
  </v-flex>


  <v-dialog v-model="dialog" max-width="350">
      <v-card>
        <v-card-title class="headline">TikTok captcha</v-card-title>
        <v-layout wrap row>
          <img src="http://127.0.0.1:5000/captcha/cp.png" style="margin-left: 50px;" id = "image" height="100" width="250">
          <v-text-field v-on:keyup.enter="captchaEnter" style="margin-left: 50px; margin-right: 50px;" value label="TikTok captcha" v-model="captcha" clearable></v-text-field>
        </v-layout>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" @click="captchaEnter" @keyup.enter="captchaEnter"> Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  

    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    youtubeUrl: "",
    instagramUrl: "",
    tiktokUrl: "",

    youtubeNum: 0,
    instagramNum: 0,
    tiktokNum: 0,

    isYT: false,
    isIN: false,
    isTT: false,
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
    async getYoutube() {
      this.isErr = false;
      this.isYT = true;
      try {
        let answer = await this.makeReq({ site:"youtube", url: this.youtubeUrl });
        /* eslint-disable no-console */
        console.log(`getNumWords got result`, answer);
        this.youtubeNum = answer;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getNumWords got error`, error);
        this.isErr = true;
        this.youtubeNum = 0;
      } finally {
        this.isYT = false;
      }
    },

    async getInstagram() {
      
      this.isErr = false;
      this.isIN = true;
      try {
        let answer = await this.makeReq({ site:"instagram", url: this.instagramUrl });
        /* eslint-disable no-console */
        console.log(`getNumWords got result`, answer);

        this.instagramNum = answer;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getNumWords got error`, error);
        this.isErr = true;
        this.instagramNum = 0;
      } finally {
        this.isIN = false;
      }
    },
    
    captchaEnter: function(){
      this.getTiktok(this.captcha);
      this.dialog = false;
    },

    async getTiktok(_captcha) {
      // Kostyl, call from search button
      if(typeof(_captcha)== "object"){
        _captcha=""
        this.captcha = ""
      }

      this.isErr = false;
      this.isTT = true;
      
      try {
        let answer = await this.makeReqTikt({ site:"tiktok", 
        url: this.tiktokUrl, captcha: _captcha});
        /* eslint-disable no-console */
        if (answer == "image"){
          this.dialog = true;
          //console.log("Answer: "+ answer)
          let img = document.getElementById("image");
          img.src = "http://127.0.0.1:5000/captcha/cp.png?dummy="+ Math.random(0, 1000)
        } else {
            this.tiktokNum = answer;
        }
     
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getNumWords got error`, error);
        this.isErr = true;
        this.tiktokNum = 0;
      } finally {
        this.isTT = false;
        this.captcha = ""
      }
    },

    makeReq({ site, url }) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(`http://127.0.0.1:5000/${site}`, {
            params: { url: url }
          })
          .then(response => {
            /* eslint-disable no-console */
            console.log(`response.bodyText`, response.bodyText);
            return resolve(response.bodyText);
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
          .get(`http://127.0.0.1:5000/${site}`, {
            params: { url: url, captcha: captcha}
          })
          .then(response => {
            /* eslint-disable no-console */
            console.log(`response`, response);
            return resolve(response.bodyText);
          })
          .catch(err => {
            console.log(`makeReq got err`, err);
            return reject(err);
          });
      });
    }
  }
};
</script>

<style>
.padding {
  height: 100px;
}
.box{
  padding-top:30px;
  padding-left:10px;
  padding-right:10px;
  margin-bottom: 50px;
}
</style>
