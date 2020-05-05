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

    //TODO hide Ears, Teeth, and Limited Food features, by setting visibleProperty for associated PhET-iO elements
    // naturalSelection.labScreen.view.addMutationsPanel.earsRow
    // naturalSelection.labScreen.view.addMutationsPanel.teethRow
    // naturalSelection.labScreen.view.environmentalFactorsPanel.limitedFoodCheckbox
    // naturalSelection.labScreen.view.graphs.pedigreeNode.allelesPanel.earsRow
    // naturalSelection.labScreen.view.graphs.pedigreeNode.allelesPanel.teethRow
    // naturalSelection.labScreen.view.graphs.populationNode.populationPanel.straightEarsCheckbox
    // naturalSelection.labScreen.view.graphs.populationNode.populationPanel.floppyEarsCheckbox
    // naturalSelection.labScreen.view.graphs.populationNode.populationPanel.shortTeethCheckbox
    // naturalSelection.labScreen.view.graphs.populationNode.populationPanel.longTeethCheckbox
    // naturalSelection.labScreen.view.graphs.proportionsNode.proportionsPanel.legendNode.earsLegendNode
    // naturalSelection.labScreen.view.graphs.proportionsNode.proportionsPanel.legendNode.teethLegendNode
    // naturalSelection.labScreen.view.graphs.proportionsNode.proportionsGraphNode.earsColumn
    // naturalSelection.labScreen.view.graphs.proportionsNode.proportionsGraphNode.teethColumn
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