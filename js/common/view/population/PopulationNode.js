// Copyright 2019-2020, University of Colorado Boulder

/**
 * PopulationNode is the parent for all parts of the 'Population' view.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import merge from '../../../../../phet-core/js/merge.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import PopulationModel from '../../model/PopulationModel.js';
import NaturalSelectionConstants from '../../NaturalSelectionConstants.js';
import PopulationGraphNode from './PopulationGraphNode.js';
import PopulationPanel from './PopulationPanel.js';

class PopulationNode extends Node {

  /**
   * @param {PopulationModel} populationModel
   * @param {Dimension2} size - dimensions of the rectangle available for this Node and its children
   * @param {Object} [options]
   */
  constructor( populationModel, size, options ) {

    assert && assert( populationModel instanceof PopulationModel, 'invalid populationModel' );
    assert && assert( size instanceof Dimension2, 'invalid size' );

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioDocumentation: 'the Population graph and its control panel',
      phetioComponentOptions: { visibleProperty: { phetioReadOnly: true } }
    }, options );

    // Divy up the width
    const panelWidth = 0.25 * size.width;
    const graphWidth = size.width - panelWidth - NaturalSelectionConstants.SCREEN_VIEW_X_SPACING;

    const populationPanel = new PopulationPanel( populationModel, {
      fixedWidth: panelWidth,
      maxHeight: size.height,
      tandem: options.tandem.createTandem( 'populationPanel' )
    } );

    const populationGraphNode = new PopulationGraphNode( populationModel, {
      graphWidth: graphWidth,
      graphHeight: size.height,
      y: populationPanel.top,
      left: populationPanel.right + NaturalSelectionConstants.SCREEN_VIEW_X_SPACING,
      tandem: options.tandem.createTandem( 'populationGraphNode' )
    } );

    assert && assert( !options.children, 'PopulationNode sets children' );
    options.children = [ populationPanel, populationGraphNode ];

    super( options );

    // @private
    this.populationGraphNode = populationGraphNode;

    // Create a link to the model that this Node displays
    this.addLinkedElement( populationModel, {
      tandem: options.tandem.createTandem( 'populationModel' )
    } );
  }

  /**
   * @public
   */
  reset() {
    this.populationGraphNode.reset();
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'PopulationNode does not support dispose' );
  }
}

naturalSelection.register( 'PopulationNode', PopulationNode );
export default PopulationNode;