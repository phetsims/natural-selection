// Copyright 2019-2022, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Text, TextOptions } from '../../../../scenery/js/imports.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GraphChoice from './GraphChoice.js';

// constants
const TEXT_OPTIONS: StrictOmit<TextOptions, 'tandem'> = {
  font: NaturalSelectionConstants.RADIO_BUTTON_FONT,
  maxWidth: 175 // determined empirically
};

type SelfOptions = EmptySelfOptions;

type GraphChoiceRadioButtonGroupOptions = SelfOptions & VerticalAquaRadioButtonGroupOptions &
  PickRequired<VerticalAquaRadioButtonGroupOptions, 'tandem'>;

export default class GraphChoiceRadioButtonGroup extends VerticalAquaRadioButtonGroup<GraphChoice> {

  public constructor( graphChoiceProperty: EnumerationProperty<GraphChoice>,
                      providedOptions: GraphChoiceRadioButtonGroupOptions ) {

    const options = optionize<GraphChoiceRadioButtonGroupOptions, SelfOptions, VerticalAquaRadioButtonGroupOptions>()( {

      // VerticalAquaRadioButtonGroupOptions
      spacing: 12,
      touchAreaXDilation: 8,
      mouseAreaXDilation: 8
    }, providedOptions );

    // Create the description of the buttons
    const items = [

      // Population
      {
        value: GraphChoice.POPULATION,
        createNode: ( tandem: Tandem ) => new Text( NaturalSelectionStrings.populationStringProperty,
          combineOptions<TextOptions>( {
            tandem: tandem.createTandem( 'labelText' )
          }, TEXT_OPTIONS ) ),
        tandemName: `population${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },

      // Proportions
      {
        value: GraphChoice.PROPORTIONS,
        createNode: ( tandem: Tandem ) => new Text( NaturalSelectionStrings.proportionsStringProperty,
          combineOptions<TextOptions>( {
            tandem: tandem.createTandem( 'labelText' )
          }, TEXT_OPTIONS ) ),
        tandemName: `proportions${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },

      // Pedigree
      {
        value: GraphChoice.PEDIGREE,
        createNode: ( tandem: Tandem ) => new Text( NaturalSelectionStrings.pedigreeStringProperty,
          combineOptions<TextOptions>( {
            tandem: tandem.createTandem( 'labelText' )
          }, TEXT_OPTIONS ) ),
        tandemName: `pedigree${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      },

      // None
      {
        value: GraphChoice.NONE,
        createNode: ( tandem: Tandem ) => new Text( NaturalSelectionStrings.noneStringProperty,
          combineOptions<TextOptions>( {
            tandem: tandem.createTandem( 'labelText' )
          }, TEXT_OPTIONS ) ),
        tandemName: `none${AquaRadioButton.TANDEM_NAME_SUFFIX}`
      }
    ];

    super( graphChoiceProperty, items, options );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

naturalSelection.register( 'GraphChoiceRadioButtonGroup', GraphChoiceRadioButtonGroup );