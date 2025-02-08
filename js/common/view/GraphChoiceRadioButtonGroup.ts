// Copyright 2019-2025, University of Colorado Boulder

/**
 * GraphsRadioButtonGroup is the radio button group for selecting which of the graphs is visible.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import Text, { TextOptions } from '../../../../scenery/js/nodes/Text.js';
import VerticalAquaRadioButtonGroup, { VerticalAquaRadioButtonGroupOptions } from '../../../../sun/js/VerticalAquaRadioButtonGroup.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionStrings from '../../NaturalSelectionStrings.js';
import NaturalSelectionConstants from '../NaturalSelectionConstants.js';
import GraphChoice from './GraphChoice.js';

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
      mouseAreaXDilation: 8,
      isDisposable: false
    }, providedOptions );

    // Create the description of the buttons
    const items = [

      // Population
      {
        value: GraphChoice.POPULATION,
        createNode: () => new Text( NaturalSelectionStrings.populationStringProperty, TEXT_OPTIONS ),
        tandemName: 'populationRadioButton'
      },

      // Proportions
      {
        value: GraphChoice.PROPORTIONS,
        createNode: () => new Text( NaturalSelectionStrings.proportionsStringProperty, TEXT_OPTIONS ),
        tandemName: 'proportionsRadioButton'
      },

      // Pedigree
      {
        value: GraphChoice.PEDIGREE,
        createNode: () => new Text( NaturalSelectionStrings.pedigreeStringProperty, TEXT_OPTIONS ),
        tandemName: 'pedigreeRadioButton'
      },

      // None
      {
        value: GraphChoice.NONE,
        createNode: () => new Text( NaturalSelectionStrings.noneStringProperty, TEXT_OPTIONS ),
        tandemName: 'noneRadioButton'
      }
    ];

    super( graphChoiceProperty, items, options );
  }
}

naturalSelection.register( 'GraphChoiceRadioButtonGroup', GraphChoiceRadioButtonGroup );