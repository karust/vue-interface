<template>
  <v-app>
    <v-content>

      <v-container>
      <v-flex xs12 md6 offset-xs3>
        <v-alert :value="isErr" color="warning" icon="priority_high" transition="scale-transition" outline>
          {{errMsg}}
        </v-alert>
      </v-flex>

      <v-layout text-xs-center row wrap justify-center>
        <v-flex xs12 md 10 lg6>
          <YouTube/>
          <Instagram/>
          <TikTok/>
          <Facebook/>
        </v-flex>
      </v-layout>
    </v-container>
    </v-content>
  </v-app>
</template>

<script>
import YouTube from './components/YouTube'
import Instagram from './components/Instagram'
import TikTok from './components/TikTok'
import Facebook from './components/Facebook'

import { eventBus } from './main';

export default {
  name: 'App',
  components: {
    YouTube,
    Instagram,
    TikTok,
    Facebook,
  },
  data () {
    return {
      isErr: false,
      errMsg: "Wrong request",
    }
  },

  created(){
    eventBus.$on('errorAlert', (message) => {
     this.isErr = true;
     this.errMsg = message;
    });
  }
}
</script>
