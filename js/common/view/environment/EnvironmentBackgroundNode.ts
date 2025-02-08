// Copyright 2019-2025, University of Colorado Boulder

/**
 * EnvironmentBackgroundNode shows the background image that corresponds to the environment.
 * The image is scaled to fit the specified dimensions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../../axon/js/EnumerationProperty.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Line from '../../../../../scenery/js/nodes/Line.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import arcticBackground_png from '../../../../images/arcticBackground_png.js';
import equatorBackground_png from '../../../../images/equatorBackground_png.js';
import naturalSelection from '../../../naturalSelection.js';
import Environment from '../../model/Environment.js';
import NaturalSelectionQueryParameters from '../../NaturalSelectionQueryParameters.js';

export default class EnvironmentBackgroundNode extends Node {

  /**
   * @param environmentProperty
   * @param size - dimensions of the backgrounds, in view coordinates
   * @param yHorizon - y coordinate of the horizon, in view coordinates
   */
  public constructor( environmentProperty: EnumerationProperty<Environment>, size: Dimension2, yHorizon: number ) {

    // Equator background, scaled to fit
    const equatorBackground = new Image( equatorBackground_png );
    equatorBackground.setScaleMagnitude( size.width / equatorBackground.width, size.height / equatorBackground.height );

    // Arctic background, scaled to fit
    const arcticBackground = new Image( arcticBackground_png );
    arcticBackground.setScaleMagnitude( size.width / arcticBackground.width, size.height / arcticBackground.height );

    const children: Node[] = [ equatorBackground, arcticBackground ];

    // Horizon line, for debugging. Bunnies cannot go further from the viewer than this line.
    if ( NaturalSelectionQueryParameters.showHorizon ) {
      children.push( new Line( 0, yHorizon, size.width, yHorizon, {
        stroke: 'red',
        lineWidth: 1
      } ) );
    }

    super( {
      children: children,
      isDisposable: false
    } );

    // Show the background that matches the environment. unlink is not necessary.
    environmentProperty.link( environment => {
      equatorBackground.visible = ( environment === Environment.EQUATOR );
      arcticBackground.visible = ( environment === Environment.ARCTIC );
    } );
  }
}

naturalSelection.register( 'EnvironmentBackgroundNode', EnvironmentBackgroundNode );