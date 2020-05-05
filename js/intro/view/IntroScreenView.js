// Copyright 2019-2020, University of Colorado Boulder

/**
 * IntroView is the view for the 'Intro' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import NaturalSelectionScreenView from '../../common/view/NaturalSelectionScreenView.js';
import naturalSelection from '../../naturalSelection.js';
import IntroModel from '../model/IntroModel.js';

class IntroScreenView extends NaturalSelectionScreenView {

  /**
   * @param {IntroModel} model
   * @param {Tandem} tandem
   */
  constructor( model, tandem ) {

    assert && assert( model instanceof IntroModel, 'invalid model' );
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    super( model, {

      // phet-io
      tandem: tandem
    } );

    //TODO see https://github.com/phetsims/natural-selection/issues/70
    // hide Ears, Teeth, and Limited Food features, by setting visibleProperty for associated PhET-iO elements
    this.addMutationsPanel.earsRow.visibleProperty.value = false;
    this.addMutationsPanel.teethRow.visibleProperty.value = false;
    this.environmentalFactorsPanel.limitedFoodCheckbox.visibleProperty.value = false;
    this.populationNode.populationPanel.straightEarsCheckbox.visibleProperty.value = false;
    this.populationNode.populationPanel.floppyEarsCheckbox.visibleProperty.value = false;
    this.populationNode.populationPanel.shortTeethCheckbox.visibleProperty.value = false;
    this.populationNode.populationPanel.longTeethCheckbox.visibleProperty.value = false;
    this.proportionsNode.proportionsPanel.legendNode.earsLegendNode.visibleProperty.value = false;
    this.proportionsNode.proportionsPanel.legendNode.teethLegendNode.visibleProperty.value = false;
    // this.proportionsNode.proportionsGraphNode.earsColumn
    // this.proportionsNode.proportionsGraphNode.teethColumn
    this.pedigreeNode.allelesPanel.earsRow.visibleProperty.value = false;
    this.pedigreeNode.allelesPanel.teethRow.visibleProperty.value = false;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'IntroScreenView does not support dispose' );
  }
}

naturalSelection.register( 'IntroScreenView', IntroScreenView );
export default IntroScreenView;