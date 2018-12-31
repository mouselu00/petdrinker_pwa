// doc:https://segmentfault.com/a/1190000016258735
<template>
  <div class="SetupPage">
    <v-layout v-show="true" row wrap align-center justify-center>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-title primary-title>
            <v-flex>
              <v-form>
                <v-text-field
                  :disabled="haveDeviceNumber"
                  v-model="deviceNumber"
                  :rules="nameRules"
                  label="序列號"
                  hint="此設備的序號附在盒子內"
                  required
                ></v-text-field>
              </v-form>
            </v-flex>
          </v-card-title>
          <v-card-actions>
            <v-flex xs12 sm6 d-flex>
              <v-btn :disabled="disableBtn" color="primary" @click="handleAdd">確定</v-btn>
            </v-flex>
            <v-flex xs12 sm6 d-flex>
              <v-btn @click="handleClear">清除</v-btn>
            </v-flex>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-title primary-title>
            <v-layout align-center justify-center column fill-height>
              <h2>韌體更新</h2>
              <p>版本編號：
                <v-chip color="black" style="color:#ffffff">ptos181226_1927</v-chip>
              </p>
              <v-btn block color="success" @click="handleFaceToggle">檢查更新</v-btn>
            </v-layout>
          </v-card-title>
        </v-card>
      </v-flex>
      <v-snackbar
        v-model="snackbar"
        :color="snackbarColor"
        :multi-line="false"
        :timeout="5000"
        :vertical="false"
      >
        {{snacbarText}}
        <v-btn dark flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
    </v-layout>
  </div>
</template>
<script>
import axios from "axios";
import { uuid } from "vue-idb";

export default {
  name: "SetupPage",
  data() {
    return {
      deviceNumber: "",
      haveDeviceNumber: false,
      nameRules: [
        v => !!v || "序列號需要填寫",
        v => (v && v.length >= 10) || "序列號不可小過10字元"
      ],
      snackbar: false,
      snacbarText: "",
      snackbarColor: "",
      disableBtn: true
    };
  },
  methods: {
    handleClear: function() {
      this.deviceNumber = "";
      this.haveDeviceNumber = false;
    },
    handleUpdate() {
      this.$db.petDrinkerTable.toArray().then(data => {
        this.deviceNumber = data[0].serial_number;
        this.haveDeviceNumber = true;
        this.disableBtn = true;
        // console.log(data[0]);
      });
    },
    handleAdd() {
      this.$db.petDrinkerTable.clear().then(() => {
        this.$db.petDrinkerTable
          .add({
            id: uuid(),
            serial_number: this.deviceNumber,
            created_at: new Date(),
            updated_at: new Date()
          })
          .then(() => {
            this.haveDeviceNumber = true;
            this.snacbarText = "序列號設置成功";
            this.snackbar = true;
            this.snackbarColor = "success";
          })
          .catch(() => {
            this.snacbarText = "序列號設置失敗";
            this.snackbar = true;
            this.snackbarColor = "error";
          });
      });
    },
    handleFaceToggle() {
      this.snacbarText = "已是最新版本";
      this.snackbar = true;
      this.snackbarColor = "success";
    }
    // handleRemove(test) {
    //   this.$db.tests
    //     .where("id")
    //     .eq(test.id)
    //     .delete()
    //     .then(() => this.update());
    // },
  },
  mounted() {
    this.handleUpdate();
  },
  watch: {
    // whenever question changes, this function will run
    deviceNumber: function(val) {
      this.deviceNumber = val;
      this.disableBtn = this.deviceNumber.length < 10 ? true : false;
    }
  }
};
</script>
<style>
</style>

