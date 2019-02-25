<template>

    <v-card class="box">
    <v-layout row wrap justify-center>
        <v-flex xs8 md8 lg10>
            <v-text-field v-on:keyup.enter="getInstagram" value label="Instagram URL" v-model="instURL" clearable></v-text-field>
        </v-flex>
        <v-btn @click="getInstagram" outline dark large color="orange">
            <v-icon dark>search</v-icon>
        </v-btn>
    </v-layout>

    <v-flex xs12 md12 lg12>
    <v-progress-linear color="orange" :active="isIN" :indeterminate="true"></v-progress-linear>
    </v-flex> 

    <h3 class="text-md-center">
    <v-chip label outline color="orange">
        <h3>{{instComm}}</h3>
    </v-chip> in commnets
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

    instURL: "",
    instComm: 0,

    isIN: false,
    isErr: false,
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
    async getInstagram() {
      this.isErr = false;
      this.isIN = true;
      this.instComm = 0;
      try {
        let answer = await this.makeReq({ site:"instagram", url: this.instURL });
        /* eslint-disable no-console */
        console.log(`getInstagram got result`, answer);
        this.instComm = answer.comments;

        this.nums[0].one = answer.ones;
        this.nums[0].two = answer.twos;
        this.nums[0].three = answer.threes;
        this.nums[0].four = answer.fours;
        eventBus.$emit('successAlert', "Instagram parsing finished")
      } catch (error) {
        /* eslint-disable no-console */
        console.log(`getInstagram got error`, error);
        eventBus.$emit('errorAlert', "Instagram request failed")
        this.isErr = true;
        this.instComm = 0;
        this.nums = this.numsEmpty;
      } finally {
        this.isIN = false;
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
