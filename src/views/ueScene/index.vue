<template>
  <div id="map">
    <div id="playerUI">
      <div id="player" />
      <div id="overlay" class="overlay text-light bg-dark">
        <div>
          <div id="qualityStatus" class="greyStatus">&#9679</div>
          <div id="overlayButton">+</div>
        </div>
        <div id="overlaySettings">
          <div id="kickOthers">
            <div class="settings-text">Kick all other players</div>
            <label class="btn-overlay">
              <input id="kick-other-players-button" type="button" class="overlay-button btn-flat" value="Kick">
            </label>
          </div>
          <div id="fillWindow">
            <div class="settings-text">Enlarge Display to Fill Window</div>
            <label class="tgl-switch">
              <input id="enlarge-display-to-fill-window-tgl" type="checkbox" class="tgl tgl-flat" checked>
              <div class="tgl-slider" />
            </label>
          </div>
          <div id="qualityControlOwnership">
            <div class="settings-text">Quality control ownership</div>
            <label class="tgl-switch">
              <input id="quality-control-ownership-tgl" type="checkbox" class="tgl tgl-flat">
              <div class="tgl-slider" />
            </label>
          </div>
          <br>

          <section id="encoderSettings">
            <div class="settings-text">Encoder Settings</div>
            <div id="encoderParamsContainer" class="collapse">
              <div class="form-group">
                <label for="encoder-rate-control" class="settings-text">Rate Control</label>
                <select id="encoder-rate-control">
                  <option value="CBR" selected>CBR</option>
                  <option value="VBR">VBR</option>
                  <option value="ConstQP">ConstQP</option>
                </select>
                <br>
                <label for="encoder-target-bitrate-text">Target Bitrate (kbps)</label>
                <input id="encoder-target-bitrate-text" type="number" class="form-control" value="0" min="0" max="100000"><br>
                <label for="encoder-max-bitrate-text">Max Bitrate (kbps)</label>
                <input id="encoder-max-bitrate-text" type="number" class="form-control" value="0" min="0" max="100000"><br>
                <label for="encoder-min-qp-text">Min QP</label>
                <input id="encoder-min-qp-text" type="number" class="form-control" value="0" min="0" max="999"><br>
                <label for="encoder-max-qp-text">Max QP</label>
                <input id="encoder-max-qp-text" type="number" class="form-control" value="0" min="0" max="999"><br>
                <div class="settings-text">Filler Data</div>
                <label class="tgl-switch">
                  <input id="encoder-filler-data-tgl" type="checkbox" class="tgl tgl-flat">
                  <div class="tgl-slider" />
                </label>
                <br>
                <label for="encoder-multipass" class="settings-text">Multipass</label>
                <select id="encoder-multipass">
                  <option value="DISABLED" selected>DISABLED</option>
                  <option value="QUARTER">QUARTER</option>
                  <option value="FULL">FULL</option>
                </select><br>
                <input id="encoder-params-submit" class="btn btn-primary btn-lg mt-3" type="button" value="Apply">
              </div>
            </div>
            <br>
          </section>

          <section id="webRTCSettings">
            <div class="settings-text">WebRTC Settings</div>
            <div id="webrtcParamsContainer" class="collapse">
              <div class="form-group">
                <label for="webrtc-degradation-pref">Degradation Pref</label>
                <select id="webrtc-degradation-pref">
                  <option value="BALANCED">BALANCED</option>
                  <option value="MAINTAIN_FRAMERATE">MAINTAIN_FRAMERATE</option>
                  <option value="MAINTAIN_RESOLUTION">MAINTAIN_RESOLUTION</option>
                </select><br>
                <label for="webrtc-max-fps-text">Max FPS</label>
                <input id="webrtc-max-fps-text" type="number" class="form-control" value="1" min="1" max="999"><br>
                <label for="webrtc-min-bitrate-text">Min Bitrate (kbps)</label>
                <input id="webrtc-min-bitrate-text" type="number" class="form-control" value="0" min="0" max="100000"><br>
                <label for="webrtc-max-bitrate-text">Max Bitrate (kbps)</label>
                <input id="webrtc-max-bitrate-text" type="number" class="form-control" value="0" min="0" max="100000"><br>
                <label for="webrtc-low-qp-text">Low QP Threshold</label>
                <input id="webrtc-low-qp-text" type="number" class="form-control" value="0" min="0" max="999"><br>
                <label for="webrtc-high-qp-text">High QP Threshold</label>
                <input id="webrtc-high-qp-text" type="number" class="form-control" value="0" min="0" max="999"><br>
                <input id="webrtc-params-submit" class="btn btn-primary btn-lg mt-3" type="button" value="Apply">
              </div>
            </div>
          </section>
          <br>

          <div id="showFPS">
            <div class="settings-text">Show FPS</div>
            <label class="btn-overlay">
              <input id="show-fps-button" type="button" class="overlay-button btn-flat" value="Toggle">
            </label>
          </div>
          <div id="matchViewportResolution">
            <div class="settings-text">Match Viewport Resolution</div>
            <label class="tgl-switch">
              <input id="match-viewport-res-tgl" type="checkbox" class="tgl tgl-flat">
              <div class="tgl-slider" />
            </label>
          </div>

          <div id="statsPanel">
            <div class="settings-text">Show Stats</div>
            <label class="tgl-switch">
              <input id="show-stats-tgl" type="checkbox" class="tgl tgl-flat" checked>
              <div class="tgl-slider" />
            </label>
            <div id="statsContainer" class="statsContainer">
              <div id="stats" class="stats" />
            </div>
            <br>
          </div>

          <div id="latencyTest">
            <div class="settings-text">Latency Stats</div>
            <label class="btn-overlay">
              <input id="test-latency-button" type="button" class="overlay-button btn-flat" value="Test Latency">
            </label>
            <div id="latencyStatsContainer" class="statsContainer">
              <div id="LatencyStats" class="stats">No stats yet...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <rightPanel />
  </div>
</template>

<script>
import load from '@/mapJs/ueVideo'
import '../../../public/player.css'
import rightPanel from './components/rightPanel'
export default {
  name: 'index',
  components: {
    rightPanel
  },
  mounted() {
    load.load()
  }
}
</script>

<style scoped>

#map{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  position: absolute;

}

</style>
