// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentBackgroundNode shows the background image that corresponds to the abiotic environment.
 * The image is scaled to fit the specified dimensions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import merge from '../../../../phet-core/js/merge.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Line from '../../../../scenery/js/nodes/Line.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import arcticBackgroundImage from '../../../images/arcticBackground_png.js';
import equatorBackgroundImage from '../../../images/equatorBackground_png.js';
import naturalSelection from '../../naturalSelection.js';
import Environment from '../model/Environment.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';

class EnvironmentBackgroundNode extends Node {

  /**
   * @param {EnumerationProperty.<Environment>} environmentProperty
   * @param {Dimension2} size - dimensions of the backgrounds, in view coordinates
   * @param {number} yHorizon - y coordinate of the horizon, in view coordinates
   * @param {Object} [options]
   */
  constructor( environmentProperty, size, yHorizon, options ) {

    assert && assert( environmentProperty instanceof EnumerationProperty, 'invalid environmentProperty' );
    assert && assert( size instanceof Dimension2, 'invalid size' );
    assert && assert( typeof yHorizon === 'number', 'invalid yHorizon' );

    options = merge( {}, options );

    // Equator background, scaled to fit
    const equatorBackground = new Image( equatorBackgroundImage );
    equatorBackground.setScaleMagnitude( size.width / equatorBackground.width, size.height / equatorBackground.height );

    // Arctic background, scaled to fit
    const arcticBackground = new Image( arcticBackgroundImage );
    arcticBackground.setScaleMagnitude( size.width / arcticBackground.width, size.height / arcticBackground.height );

    assert && assert( !options.children, 'EnvironmentBackgroundNode sets children' );
    options.children = [ equatorBackground, arcticBackground ];

    super( options );

    // Horizon line, for debugging. Bunnies cannot go further from the viewer than this line.
    if ( NaturalSelectionConstants.SHOW_HORIZON ) {
      const horizonLine = new Line( 0, yHorizon, size.width, yHorizon, {
        stroke: 'red',
        lineWidth: 1
      } );
      this.addChild( horizonLine );
    }

    environmentProperty.link( climate => {
      equatorBackground.visible = ( climate === Environment.EQUATOR );
      arcticBackground.visible = ( climate === Environment.ARCTIC );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'EnvironmentBackgroundNode does not support dispose' );
  }
}

naturalSelection.register( 'EnvironmentBackgroundNode', EnvironmentBackgroundNode );
export default EnvironmentBackgroundNode;