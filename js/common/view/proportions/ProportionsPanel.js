// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsPanel is the panel that contains controls for the 'Proportions' graph.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../../scenery/js/nodes/VBox.js';
import Checkbox from '../../../../../sun/js/Checkbox.js';
import HSeparator from '../../../../../sun/js/HSeparator.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import GenePool from '../../model/GenePool.js';
import NaturalSelectionColors from '../../NaturalSelectionColors.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import NaturalSelectionPanel from '../NaturalSelectionPanel.js';
import ProportionsLegendNode from './ProportionsLegendNode.js';

class ProportionsPanel extends NaturalSelectionPanel {

  /**
   * @param {GenePool} genePool
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( genePool, valuesVisibleProperty, options ) {

    assert && assert( genePool instanceof GenePool, 'invalid genePool' );
    assert && AssertUtils.assertPropertyOf( valuesVisibleProperty, 'boolean' );

    options = merge( {
      fixedWidth: 100,
      xMargin: 0,

      // phet-io
      tandem: Tandem.REQUIRED
    }, NaturalSelectionConstants.PANEL_OPTIONS, options );

    const legendNode = new ProportionsLegendNode( genePool, {
      tandem: options.tandem.createTandem( 'legendNode' )
    } );

    const separator = new HSeparator( options.fixedWidth - 2 * options.xMargin, {
      stroke: NaturalSelectionColors.SEPARATOR_STROKE,
      tandem: options.tandem.createTandem( 'separator' )
    } );

    // Values checkbox, shows/hides values on the bars
    const valuesCheckboxLabelNode = new Text( naturalSelectionStrings.values, {
      font: NaturalSelectionConstants.CHECKBOX_FONT,
      maxWidth: 100 // determined empirically
    } );
    const valuesCheckbox = new Checkbox( valuesCheckboxLabelNode, valuesVisibleProperty,
      merge( {}, NaturalSelectionConstants.CHECKBOX_OPTIONS, {
        tandem: options.tandem.createTandem( 'valuesCheckbox' )
      } ) );
    const xDilation = 8;
    const yDilation = 6;
    valuesCheckbox.touchArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );
    valuesCheckbox.mouseArea = valuesCheckbox.localBounds.dilatedXY( xDilation, yDilation );

    const content = new VBox( merge( {}, NaturalSelectionConstants.VBOX_OPTIONS, {
      children: [
        legendNode,
        separator,
        valuesCheckbox
      ]
    } ) );

    super( content, options );

    // @private {ProportionsLegendNode}
    this.legendNode = legendNode;
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Sets visibility of the UI components related to a specific gene.
   * @param {Gene} gene
   * @param {boolean} visible
   * @public
   */
  setGeneVisible( gene, visible ) {
    this.legendNode.setGeneVisible( gene, visible );
  }
}

naturalSelection.register( 'ProportionsPanel', ProportionsPanel );
export default ProportionsPanel;