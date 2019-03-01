<template>
  <v-app>
    <v-content>
      
      <v-container>
      <v-layout text-xs-center row wrap justify-center>
        <v-flex class="err" xs12 md8 lg6>
          <v-alert  :value="isErr" color="warning" icon="priority_high" transition="scale-transition" dismissible>
            {{errMsg}}
          </v-alert>
          <v-alert :value="isSucc" color="info" type="success" transition="scale-transition" dismissible>
            {{succMsg}}
          </v-alert>
        </v-flex>
      </v-layout>

      <v-layout text-xs-center row wrap justify-center>
        <v-flex xs12 md 10 lg6>
          <YouTube/>
          <Instagram/>
          <TikTok/>
          <Facebook/>
          <Table/>
        </v-flex>
      </v-layout>
    </v-container>
    </v-content>
  </v-app>
</template>
success
<script>
import YouTube from './components/YouTube'
import Instagram from './components/Instagram'
import TikTok from './components/TikTok'
import Facebook from './components/Facebook'
import Table from './components/Table'

import { eventBus } from './main';

export default {
  name: 'App',
  components: {
    YouTube,
    Instagram,
    TikTok,
    Facebook,
    Table
  },
  data () {
    return {
      isErr: false,
      errMsg: "Wrong request",

      isSucc: false,
      succMsg: "OK",
    }
  },

  created(){
    eventBus.$on('errorAlert', (message) => {
     this.isErr = true;
     this.isSucc = false;
     this.errMsg = message;

     function hide(errObj){ errObj.isErr=false; }
     setTimeout(hide, 2500, this); 
    });

    eventBus.$on('successAlert', (message) => {
     this.isErr = false;
     this.isSucc = true;
     this.succMsg = message;

    function hide(errObj){ errObj.isSucc=false; }
    setTimeout(hide, 2500, this); 
    });
  }
}
</script>


<style>
.err {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
     vertical-align: middle;
}
</style>
