// Copyright 2019-2020, University of Colorado Boulder

/**
 * EnvironmentBackgroundNode shows the background image that corresponds to the environment.
 * The image is scaled to fit the specified dimensions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import arcticBackground_png from '../../../../images/arcticBackground_png.js';
import equatorBackground_png from '../../../../images/equatorBackground_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Environment from '../../model/Environment.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';

class EnvironmentBackgroundNode extends Node {

  /**
   * @param {EnumerationProperty.<Environment>} environmentProperty
   * @param {Dimension2} size - dimensions of the backgrounds, in view coordinates
   * @param {number} yHorizon - y coordinate of the horizon, in view coordinates
   * @param {Object} [options]
   */
  constructor( environmentProperty, size, yHorizon, options ) {

    assert && AssertUtils.assertEnumerationPropertyOf( environmentProperty, Environment );
    assert && assert( size instanceof Dimension2, 'invalid size' );
    assert && assert( typeof yHorizon === 'number', 'invalid yHorizon' );

    options = merge( {}, options );

    // Equator background, scaled to fit
    const equatorBackground = new Image( equatorBackground_png );
    equatorBackground.setScaleMagnitude( size.width / equatorBackground.width, size.height / equatorBackground.height );

    // Arctic background, scaled to fit
    const arcticBackground = new Image( arcticBackground_png );
    arcticBackground.setScaleMagnitude( size.width / arcticBackground.width, size.height / arcticBackground.height );

    assert && assert( !options.children, 'EnvironmentBackgroundNode sets children' );
    options.children = [ equatorBackground, arcticBackground ];

    // Horizon line, for debugging. Bunnies cannot go further from the viewer than this line.
    if ( NaturalSelectionQueryParameters.showHorizon ) {
      options.children.push( new Line( 0, yHorizon, size.width, yHorizon, {
        stroke: 'red',
        lineWidth: 1
      } ) );
    }

    super( options );

    // Show the background that matches the environment. unlink is not necessary.
    environmentProperty.link( environment => {
      equatorBackground.visible = ( environment === Environment.EQUATOR );
      arcticBackground.visible = ( environment === Environment.ARCTIC );
    } );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'EnvironmentBackgroundNode', EnvironmentBackgroundNode );
export default EnvironmentBackgroundNode;