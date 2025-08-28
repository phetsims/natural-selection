// Copyright 2022-2025, University of Colorado Boulder

/**
 * AlleleNode displays the abbreviation and icon for an allele.
 *
 * This was factored out of AllelesPanel.ts on 11/10/2022, so look there for git history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { TReadOnlyProperty } from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import HBox, { HBoxOptions } from '../../../../../scenery/js/layout/nodes/HBox.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';

type SelfOptions = EmptySelfOptions;

type AlleleNodeOptions = SelfOptions & PickRequired<HBoxOptions, 'tandem'>;

export default class AlleleNode extends HBox {

  private readonly imageNode: Image;

  /**
   * @param abbreviationProperty - the abbreviation used for the allele
   * @param image
   * @param [providedOptions]
   */
  public constructor( abbreviationProperty: TReadOnlyProperty<string>,
                      image: HTMLImageElement,
                      providedOptions: AlleleNodeOptions ) {

    const options = optionize<AlleleNodeOptions, SelfOptions, HBoxOptions>()( {

      // HBoxOptions
      spacing: 6,
      phetioVisiblePropertyInstrumented: false
    }, providedOptions );

    const text = new Text( abbreviationProperty, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 12 // determined empirically
    } );

    const imageNode = new Image( image, {
      scale: 0.5 // determined empirically
    } );

    options.children = [ text, imageNode ];

    super( options );

    this.imageNode = imageNode;
  }

  /**
   * Sets the allele image for this node.
   */
  public set image( value: HTMLImageElement ) {
    this.imageNode.image = value;
  }
}

naturalSelection.register( 'AlleleNode', AlleleNode );