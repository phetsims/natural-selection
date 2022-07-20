// Copyright 2019-2021, University of Colorado Boulder

/**
 * NaturalSelectionPanel is a specialization of Panel that provides a more convenient API for creating a
 * fixed-width Panel, and for disabling the Panel's content.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import merge from '../../../../phet-core/js/merge.js';
import { Node, SceneryConstants } from '../../../../scenery/js/imports.js';
import Panel from '../../../../sun/js/Panel.js';
import naturalSelection from '../../naturalSelection.js';
import NaturalSelectionUtils from '../NaturalSelectionUtils.js';

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

    assert && assert( NaturalSelectionUtils.isPositive( options.fixedWidth ) || options.fixedWidth === null,
      `invalid fixedWidth: ${options.fixedWidth}` );

    if ( options.fixedWidth ) {
      assert && assert( options.minWidth === undefined, 'NaturalSelectionPanel sets minWidth' );
      assert && assert( options.maxWidth === undefined, 'NaturalSelectionPanel sets maxWidth' );
      options.minWidth = options.fixedWidth;
      options.maxWidth = options.fixedWidth;
    }

    super( content, options );

    // @private
    this.content = content;
  }

  /**
   * Enable or disable the entire Panel content.
   * @param {boolean} enabled
   * @public
   */
  setContentEnabled( enabled ) {
    assert && assert( typeof enabled === 'boolean', 'invalid enabled' );
    this.content.pickable = enabled;
    this.content.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
  }
}

naturalSelection.register( 'NaturalSelectionPanel', NaturalSelectionPanel );
export default NaturalSelectionPanel;