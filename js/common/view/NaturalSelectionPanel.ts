// Copyright 2019-2022, University of Colorado Boulder

/**
 * NaturalSelectionPanel is a specialization of Panel that provides a more convenient API for creating a
 * fixed-width Panel, and for disabling the Panel's content.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import optionize from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import StrictOmit from '../../../../phet-core/js/types/StrictOmit.js';
import { Node, SceneryConstants } from '../../../../scenery/js/imports.js';
import Panel, { PanelOptions } from '../../../../sun/js/Panel.js';
import naturalSelection from '../../naturalSelection.js';

type SelfOptions = {
  fixedWidth?: number | null; // optional fixed width of the panel
};

export type NaturalSelectionPanelOptions = SelfOptions &
  StrictOmit<PanelOptions, 'minWidth' | 'maxWidth'> &
  PickRequired<PanelOptions, 'tandem'>;

export default class NaturalSelectionPanel extends Panel {

  private readonly content: Node;

  public constructor( content: Node, providedOptions: NaturalSelectionPanelOptions ) {

    const options = optionize<NaturalSelectionPanelOptions, SelfOptions, PanelOptions>()( {

      // SelfOptions
      fixedWidth: null
    }, providedOptions );

    assert && assert( options.fixedWidth === null || options.fixedWidth > 0,
      `invalid fixedWidth: ${options.fixedWidth}` );

    if ( options.fixedWidth ) {
      options.minWidth = options.fixedWidth;
      options.maxWidth = options.fixedWidth;
    }

    super( content, options );

    this.content = content;
  }

  /**
   * Enable or disable the entire Panel content.
   */
  public setContentEnabled( enabled: boolean ): void {
    this.content.pickable = enabled;
    this.content.opacity = enabled ? 1 : SceneryConstants.DISABLED_OPACITY;
  }
}

naturalSelection.register( 'NaturalSelectionPanel', NaturalSelectionPanel );