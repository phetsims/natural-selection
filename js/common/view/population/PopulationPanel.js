// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationPanel is the panel that contains controls for the 'Population' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../../sun/js/HSeparator.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import PopulationLegendCheckbox from './PopulationLegendCheckbox.js';

class PopulationPanel extends NaturalSelectionPanel {

  /**
   * @param {PopulationModel} populationModel
   * @param {Object} [options]
   */
  constructor( populationModel, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [

        // Total
        new PopulationLegendCheckbox( populationModel.totalVisibleProperty, naturalSelectionStrings.total, {
          color: NaturalSelectionColors.TOTAL_POPULATION,
          tandem: options.tandem.createTandem( 'totalCheckbox' )
        } ),

        // White Fur
        new PopulationLegendCheckbox( populationModel.whiteFurVisibleProperty, naturalSelectionStrings.whiteFur, {
          color: NaturalSelectionColors.FUR,
          tandem: options.tandem.createTandem( 'whiteFurCheckbox' )
        } ),

        // Brown Fur
        new PopulationLegendCheckbox( populationModel.brownFurVisibleProperty, naturalSelectionStrings.brownFur, {
          color: NaturalSelectionColors.FUR,
          isMutation: true,
          tandem: options.tandem.createTandem( 'brownFurCheckbox' )
        } ),

        // Straight Ears
        new PopulationLegendCheckbox( populationModel.straightEarsVisibleProperty, naturalSelectionStrings.straightEars, {
          color: NaturalSelectionColors.EARS,
          tandem: options.tandem.createTandem( 'straightEarsCheckbox' )
        } ),

        // Floppy Ears
        new PopulationLegendCheckbox( populationModel.floppyEarsVisibleProperty, naturalSelectionStrings.floppyEars, {
          color: NaturalSelectionColors.EARS,
          isMutation: true,
          tandem: options.tandem.createTandem( 'floppyEarsCheckbox' )
        } ),

        // Short Teeth
        new PopulationLegendCheckbox( populationModel.shortTeethVisibleProperty, naturalSelectionStrings.shortTeeth, {
          color: NaturalSelectionColors.TEETH,
          tandem: options.tandem.createTandem( 'shortTeethCheckbox' )
        } ),

        // Long Teeth
        new PopulationLegendCheckbox( populationModel.longTeethVisibleProperty, naturalSelectionStrings.longTeeth, {
          color: NaturalSelectionColors.TEETH,
          isMutation: true,
          tandem: options.tandem.createTandem( 'longTeethCheckbox' )
        } ),

        // ------
        new HSeparator( options.fixedWidth - 2 * options.xMargin, {
          stroke: NaturalSelectionColors.SEPARATOR_STROKE,
          tandem: options.tandem.createTandem( 'separator' )
        } ),

        // Data Probe
        new Checkbox(
          new Text( naturalSelectionStrings.dataProbe, {
            font: NaturalSelectionConstants.CHECKBOX_FONT,
            maxWidth: 135 // determined empirically
          } ),
          populationModel.dataProbe.visibleProperty,
          merge( {
            tandem: options.tandem.createTandem( 'dataProbeCheckbox' )
          }, NaturalSelectionConstants.CHECKBOX_OPTIONS )
        )
      ]
    } ) );

    super( content, options );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PopulationPanel does not support dispose' );
  }
}

naturalSelection.register( 'PopulationPanel', PopulationPanel );
export default PopulationPanel;