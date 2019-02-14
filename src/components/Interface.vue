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
        <v-select attach :items="items" v-model="site" @click="inputClicked"></v-select>
      </v-flex>

      <v-flex xs12 md6 offset-xs3>
        <v-text-field value label="URL" v-model="url" clearable @click="inputClicked"></v-text-field>
      </v-flex>

      <v-flex xs12 md6 offset-xs3>
        <v-layout row wrap>
          <v-text-field value label="Word" v-model="word" clearable @click="inputClicked"></v-text-field>

          <v-btn @click="inputChanged" outline dark large color="primary">
            <v-icon dark>search</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>

      <!--v-flex xs12 md6 offset-xs3>
          <v-select
            :items="items"
            attach
            chips
            label="Socail networks"
            multiple
            @input="inputChanged"
          ></v-select>
      </v-flex-->
      <v-flex xs6 md6 offset-xs3>
        <v-progress-linear :active="isLoad" :indeterminate="true"></v-progress-linear>
      </v-flex>

      <div style="height:50px;"></div>
      <v-flex xs6 md6 offset-xs3>
        <h3 class="text-md-center">The word encountered
          <v-chip label outline color="red">
            <h3>{{encounters}}</h3>
          </v-chip>times
        </h3>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    items: ["YouTube", "Instagram", "Facebook", "TikTok"],
    site: "YouTube",
    url: "",
    word: "",
    isLoad: false,
    isErr: false,
    encounters: 0
  }),

  methods: {
    async getNumWords(site, url, word) {
      try {
        let answer = await this.makeReq({ site, url, word });
        /* eslint-disable no-console */
        console.log(`getNumWords got result`, answer);
        this.encounters = answer;
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getNumWords got error`, error);
        this.isErr = true;
        this.encounters = 0;
      } finally {
        this.isLoad = false;
      }
    },

    inputClicked: function() {
      this.isErr = false;
    },

    inputChanged: function() {
      this.isLoad = true;
      switch (this.site) {
        case "YouTube":
          this.getNumWords("youtube", this.url, this.word);
          break;
        case "Instagram":
          this.getNumWords("instagram", this.url, this.word);
          break;
        case "Facebook":
          this.getNumWords("facebook", this.url, this.word);
          break;
        case "TikTok":
          this.getNumWords("tiktok", this.url, this.word);
          break;
      }
    },
    makeReq({ site, url, word }) {
      return new Promise((resolve, reject) => {
        this.$http
          .get(`http://10.1.1.192:5000/${site}`, {
            params: { url: url, keyword: word }
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
    }
  }
};
</script>

<style>
.padding {
  height: 150px;
}
</style>
