<template>
  <div class="e-grid">
    <div class="e-cell e-cell-4 e-cell-border_right">
      <div class="e-legend">
        <div class="e-legend__title">
          Status
        </div>
        <div
          id="status-code"
          :class="{ 'text-color-success': !statusCodeIndicatesFailure, 'text-color-danger': statusCodeIndicatesFailure }"
          class="e-legend__value">
          {{ statusCode }}
          <e-tooltip
            id="status-text"
            :content="statusText"
            type="helper"/>
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4 e-cell-border_right">
      <div class="e-legend e-gridcol">
        <div class="e-legend__title">
          Time
        </div>
        <div
          id="request-time"
          class="e-legend__value text-color-shade">
          {{ requestTime }}
        </div>
      </div>
    </div>
    <div class="e-cell e-cell-4">
      <div class="e-legend e-gridcol">
        <div class="e-legend__title">
          Size
        </div>
        <div
          id="response-size"
          class="e-legend__value text-color-shade">
          {{ responseSize }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import prettyMs from 'pretty-ms';
import prettyBytes from 'pretty-bytes';
import * as httpStatusCodes from 'http-status-codes';

export default {
  name: 'StatusPanel',
  computed: {
    ...mapState({
      statusCode: state => state.response.status,
      statusCodeIndicatesFailure: state => state.response.status >= 400,
      statusText: state => httpStatusCodes.getReasonPhrase(state.response.status),
      requestTime: state => prettyMs(state.response.elapsedTime || 0),
      responseSize: state => prettyBytes(state.response.body.length || 0)
    })
  }
};
</script>

<style>
</style>
