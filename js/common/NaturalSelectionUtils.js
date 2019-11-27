// Copyright 2019, University of Colorado Boulder

/**
 * NaturalSelectionUtils is a collection of utility functions used by this sim.
 * 
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( require => {
  'use strict';

  // modules
  const Color = require( 'SCENERY/util/Color' );
  const naturalSelection = require( 'NATURAL_SELECTION/naturalSelection' );

  const NaturalSelectionUtils = {

    /**
     * Converts a color to a grayscale color.
     * Green contributes the most to the intensity perceived by humans, and blue light the least.
     * This works correctly if color is already grayscale because the scaling factors sum to 1.
     * @param {Color|string} color
     * @returns {number}
     * @public
     */
    colorToGrayscale( color ) {
      const sceneryColor = new Color( color );

      // per ITU-R BT.709
      const luminance = ( sceneryColor.red * 0.2126 + sceneryColor.green * 0.7152 + sceneryColor.blue * 0.0722 );
      assert && assert( luminance >= 0 && luminance <= 255, `unexpected luminance: ${luminance}` );

      // grayscale colors have identical RGB component values
      return new Color( luminance, luminance, luminance );
    },

    /**
     * Determines whether a color is 'dark'.
     * @param {Color|string} color
     * @param {number} [luminance] - luminance or 'gray' value equivalent, range [0,255]
     * @returns {boolean}
     */
    isDarkColor( color, luminance ) {
      assert && assert( luminance === undefined || ( luminance >= 0 && luminance <= 255 ), `invalid luminance: ${luminance}` );
      return NaturalSelectionUtils.colorToGrayscale( color ).red < ( luminance === undefined ? 186 : luminance );
    },

    /**
     * Determines whether a color is 'light'.
     * @param {Color|string} color
     * @param {number} [luminance] - luminance or 'gray' value equivalent, range [0,255]
     * @returns {boolean}
     */
    isLightColor( color, luminance ) {
      return !NaturalSelectionUtils.isDarkColor( color, luminance );
    }
  };

  return naturalSelection.register( 'NaturalSelectionUtils', NaturalSelectionUtils );
} );