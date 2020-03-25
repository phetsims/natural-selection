// Copyright 2019-2020, University of Colorado Boulder

/**
 * NaturalSelectionPanel is a specialization of Panel that provides a more convenient API for creating a
 * fixed-width Panel.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Panel from '../../../../sun/js/Panel.js';
import naturalSelection from '../../naturalSelection.js';

class NaturalSelectionPanel extends Panel {

  /**
   * @param {Node} content
   * @param {Object} [options]
   */
  constructor( content, options ) {

    assert && assert( content instanceof Node, 'invalid content' );

    options = merge( {
      fixedWidth: null // {number|null} optional fixed width
    }, options );

    assert && assert( ( typeof options.fixedWidth === 'number' && options.fixedWidth > 0 ) || options.fixedWidth === null,
      `invalid fixedWidth: ${options.fixedWidth}` );

    if ( options.fixedWidth ) {
      assert && assert( typeof options.fixedWidth === 'number', `invalid fixedWidth: ${options.fixedWidth}` );

      assert && assert( options.minWidth === undefined, 'NaturalSelectionPanel sets minWidth' );
      assert && assert( options.maxWidth === undefined, 'NaturalSelectionPanel sets maxWidth' );
      options.minWidth = options.fixedWidth;
      options.maxWidth = options.fixedWidth;
    }

    super( content, options );
  }
}

naturalSelection.register( 'NaturalSelectionPanel', NaturalSelectionPanel );
export default NaturalSelectionPanel;