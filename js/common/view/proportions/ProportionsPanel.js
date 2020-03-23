// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../../sun/js/HSeparator.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelectionStrings from '../../../natural-selection-strings.js';
import naturalSelection from '../../../naturalSelection.js';
import ProportionsModel from '../../model/ProportionsModel.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';

class ProportionsPanel extends NaturalSelectionPanel {

  /**
   * @param {ProportionsModel} proportionsModel
   * @param {Object} [options]
   */
  constructor( proportionsModel, options ) {

    assert && assert( proportionsModel instanceof ProportionsModel, 'invalid proportionsModel' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [

        // Legend for alleles
        new ProportionsLegendNode( {
          tandem: options.tandem.createTandem( 'legendNode' )
        } ),

        // ---------
        new HSeparator( options.fixedWidth - 2 * options.xMargin, {
          stroke: NaturalSelectionColors.SEPARATOR_STROKE,
          tandem: options.tandem.createTandem( 'separator' )
        } ),

        // Values checkbox
        new Checkbox(
          new Text( naturalSelectionStrings.values, {
            font: NaturalSelectionConstants.CHECKBOX_FONT,
            maxWidth: 100 // determined empirically
          } ),
          proportionsModel.valuesVisibleProperty,
          merge( {
            tandem: options.tandem.createTandem( 'valuesCheckbox' )
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
    assert && assert( false, 'ProportionsPanel does not support dispose' );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );
export default ProportionsPanel;