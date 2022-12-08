// Copyright 2022, University of Colorado Boulder

/**
 * AlleleNode displays the abbreviation and icon for an allele.
 *
 * This was factored out of AllelesPanel.ts on 11/10/2022, so look there for git history.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { HBox, HBoxOptions, Image, Text } from '../../../../../scenery/js/imports.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import naturalSelection from '../../../naturalSelection.js';

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
      maxWidth: 12, // determined empirically
      tandem: options.tandem.createTandem( 'text' )
    } );

    const imageNode = new Image( image, {
      scale: 0.5 // determined empirically
    } );

    assert && assert( !options.children, 'AlleleNode sets children' );
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