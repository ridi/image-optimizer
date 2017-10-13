
const config = require('../lib/config');

const has = Object.prototype.hasOwnProperty; // cache the lookup once, in module scope
const DEFAULT_QUALITY = config.DEFAULT_QUALITY;

class Params {
  parseCmds(cmds) {
    // Check if cmds has 's' or 'w','h' separately
    const hasSize = has.call(cmds, 's');
    const hasWidth = has.call(cmds, 'w');
    const hasHeight = has.call(cmds, 'h');
    const hasQuality = has.call(cmds, 'q');

    this.parseWidth(cmds, hasSize, hasWidth);
    this.parseHeight(cmds, hasSize, hasHeight);
    this.parseQuality(cmds, hasQuality);
  }

  parseWidth(cmds, hasSize, hasWidth) {
    this.width = (function () {
      if (hasSize) {
        return cmds.s[0];
      } else if (hasWidth) {
        return cmds.w[0];
      }
      return '';
    }());
  }

  parseHeight(cmds, hasSize, hasHeight) {
    this.height = (function () {
      if (hasSize) {
        return cmds.s[1];
      } else if (hasHeight) {
        return cmds.h[0];
      }
      return '';
    }());
  }

  parseQuality(cmds, hasQuality) {
    this.quality = hasQuality ? cmds.q[0] : DEFAULT_QUALITY;
  }
}

module.exports = Params;

