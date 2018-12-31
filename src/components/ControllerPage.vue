// Paho mqtt javascript api : https://www.eclipse.org/paho/files/jsdoc/Paho.MQTT.Client.html
// mqtt websocket client website : http://www.hivemq.com/demos/websocket-client/
// demo :https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js
<template>
  <div class="ControllerPage">
    <v-layout row wrap align-center justify-center>
      <v-flex xs12 sm8 lg8>
        <v-layout row align-center justify-space-between>
          <v-flex md6>
            <v-card style="height:13rem">
              <v-card-title>
                <v-card-text class="display-2">{{this.tempNow}}&#8451;</v-card-text>
                <v-card-text>即時水溫</v-card-text>
              </v-card-title>
            </v-card>
          </v-flex>
          <v-flex md6>
            <v-card style="height:13rem">
              <v-card-title>
                <v-card-text
                  :style="{'color':waterNowStatus}"
                  class="display-2"
                >{{waterNow | filterWaterLevel}}</v-card-text>
                <v-card-text>即時水量</v-card-text>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm8 lg8>
        <v-card>
          <v-container>
            <v-layout row align-center justify-space-between>
              <v-flex md6>
                <v-card-title primary-title>
                  <v-card-text class="font-weight-black">
                    連線狀態 :
                    <span :class="{ '已連線': connectStatus, '未連線': !connectStatus }"></span>
                  </v-card-text>
                </v-card-title>
              </v-flex>
              <v-flex md6>
                <v-card-actions>
                  <div v-if="connectStatus" class="mx-auto">
                    <v-btn class="mx-auto" color="error" @click="onDisconnetHandle">請求斷線</v-btn>
                  </div>
                  <div v-else class="mx-auto">
                    <v-btn
                      class="mx-auto"
                      color="success"
                      :disabled="disableConnectBtn"
                      @click="connectToggle"
                    >請求連線</v-btn>
                  </div>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
      <v-flex xs12 sm8 lg8>
        <v-card>
          <v-container>
            <v-layout row align-center justify-space-between>
              <v-flex md6>
                <v-card-title primary-title>
                  <v-card-text class="font-weight-black">溫控模式 :</v-card-text>
                </v-card-title>
              </v-flex>
              <v-flex md6>
                <v-card-actions>
                  <v-btn class="mx-auto" @click="toggleBtn('tempMode')">{{tempMode | filterTemp}}</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 lg8>
        <v-card>
          <v-container>
            <v-layout row align-center justify-space-between>
              <v-flex md6>
                <v-card-title primary-title>
                  <v-card-text class="font-weight-black">供水模式 :</v-card-text>
                </v-card-title>
              </v-flex>
              <v-flex md6>
                <v-card-actions>
                  <v-btn class="mx-auto" @click="toggleBtn('waterMode')">{{waterMode | filterWater}}</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>

      <v-flex xs12 sm8 lg8>
        <v-card>
          <v-container>
            <v-layout row align-center justify-space-between>
              <v-flex md6>
                <v-card-title primary-title>
                  <v-card-text class="font-weight-black">燈光模式 :</v-card-text>
                </v-card-title>
              </v-flex>
              <v-flex md6>
                <v-card-actions>
                  <v-btn class="mx-auto" @click="toggleBtn('lightMode')">{{lightMode | filterLight}}</v-btn>
                </v-card-actions>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Paho from "paho.mqtt.js";
let Client = null;

export default {
  name: "HelloWorld",
  data() {
    return {
      tempNow: 0,
      tempMode: 0,
      waterNow: 0,
      waterMode: 0,
      lightMode: 0,
      tempCode: 3,
      waterCode: 2,
      lightsCode: 2,
      Qos: 2,
      connectStatus: false,
      waterNowStatus: "#00E676",
      deviceNumber: "",
      disableConnectBtn: true
    };
  },
  methods: {
    toggleBtn: function(toggleBtnType) {
      if (this.connectStatus) {
        switch (toggleBtnType) {
          case "tempMode":
            if (this.tempMode + 1 > this.tempCode) {
              this.tempMode = 0;
            } else {
              this.tempMode += 1;
            }
            break;
          case "waterMode":
            if (this.waterMode + 1 > this.waterCode) {
              this.waterMode = 0;
            } else {
              this.waterMode += 1;
            }
            break;
          case "lightMode":
            if (this.lightMode + 1 > this.lightsCode) {
              this.lightMode = 0;
            } else {
              this.lightMode += 1;
              console.log(this.lightMode);
            }
            break;
          default:
            break;
        }

        let dataSend = `{"tempMode":${this.tempMode},"waterMode":${
          this.waterMode
        },"lightMode":${this.lightMode}}`;
        console.log(dataSend);
        var message = new Paho.Message(dataSend);
        message.destinationName = `${this.deviceNumber}/petDrinker/mode`;
        message.qos = this.Qos;
        message.retained = true;
        Client.send(message);
      }
    },
    connectToggle: function() {
      if (!this.connectStatus) {
        Client = new Paho.Client(
          "test.mosquitto.org",
          // "broker.mqttdashboard.com",
          Number(8081),
          // "/ws"
          "/mqtt",
          // "clientId121"
        );
        Client.startTrace();
        // set callback handlers
        Client.onConnectionLost = this.onConnectionLostHandle;
        Client.onMessageArrived = this.onMessageArrivedHandle;
        // connect the client
        this.connectStatus = Client.connect({
          onSuccess: this.onConnectedHandle,
          onFailure: this.onFailConenectHandle,
          useSSL: true
        }); //wss or ws
        console.log("attempting to connect...");
      }
    },
    onConnectedHandle: function() {
      this.connectStatus = true;
      Client.subscribe(`${this.deviceNumber}/petDrinker/mode`, {
        qos: this.Qos,
        onSuccess: () => console.log("petDrinker/mode subscribe"),
        onFailure: () => console.log("petDrinker/mode subscribe fail")
      });
      Client.subscribe(`${this.deviceNumber}/petDrinker/now`, {
        qos: this.Qos,
        onSuccess: () => console.log("petDrinker/now subscribe"),
        onFailure: () => console.log("petDrinker/now subscribe fail")
      });
      console.log("onConnect");
    },
    onFailConenectHandle: function() {
      this.connectStatus = false;
    },
    onConnectionLostHandle: function(responseObject) {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        this.connectStatus = false;
      }
    },
    onMessageArrivedHandle: function(payload) {
      console.log(payload.payloadString);
      if (payload.destinationName == `${this.deviceNumber}/petDrinker/mode`) {
        let payloadJson = JSON.parse(payload.payloadString);
        this.tempMode = payloadJson.tempMode;
        this.waterMode = payloadJson.waterMode;
        this.lightMode = payloadJson.lightMode;
      }
      if (payload.destinationName == `${this.deviceNumber}/petDrinker/now`) {
        let payloadJson = JSON.parse(payload.payloadString);
        this.tempNow = payloadJson.tempNow;
        this.waterNow = payloadJson.waterNow;
        switch (this.waterNow) {
          case 1:
            this.waterNowStatus  = "#FF1744";
            break;
          case 2:
            this.waterNowStatus  = "#F57C00";
            break;
          case 3:
            this.waterNowStatus  = "#FFFF00";
            break;
          default:
            this.waterNowStatus  = "#00E676";
            break;
        }
      }
    },
    onDisconnetHandle: function() {
      if (this.connectStatus) {
        Client.disconnect();
        console.log("Disconnected");
        this.connectStatus = false;
      }
    },
    cheackDeviceNumber: function() {
      this.$db.petDrinkerTable.toArray().then(data => {
        if (data[0].serial_number != "") {
          this.deviceNumber = data[0].serial_number;
          this.disableConnectBtn = false;
        }
      });
    }
  },
  filters: {
    filterTemp: function(val) {
      let StateName = "";
      switch (val) {
        case 1:
          StateName = "冰涼";
          break;
        case 2:
          StateName = "平衡";
          break;
        case 3:
          StateName = "溫暖";
          break;
        default:
          StateName = "關閉";
          break;
      }
      return StateName;
    },
    filterWater: function(val) {
      let StateName = "";
      switch (val) {
        case 1:
          StateName = "持續循環";
          break;
        case 2:
          StateName = "自動感測";
          break;
        default:
          StateName = "關閉";
          break;
      }
      return StateName;
    },
    filterLight: function(val) {
      let StateName = "";
      switch (val) {
        case 1:
          StateName = "開啟";
          break;
        case 2:
          StateName = "夜間";
          break;
        default:
          StateName = "關閉";
          break;
      }
      return StateName;
    },
    filterWaterLevel: function(val) {
      let StateName = "";
      switch (val) {
        case 1:
          StateName = "不足";
          break;
        case 2:
          StateName = "注意";
          break;
        case 3:
          StateName = "足夠";
          break;
        default:
          StateName = "充足";
          break;
      }
      return StateName;
    }
  },
  mounted: function() {
    this.cheackDeviceNumber();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.connect {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: green;
  display: inline-block;
}

.disconnect {
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: #f44336;
  display: inline-block;
}

.waterLow {
  color: #f44336;
}
</style>
