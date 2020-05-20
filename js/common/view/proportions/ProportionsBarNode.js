// Copyright 2019-2020, University of Colorado Boulder

/**
 * ProportionsBarNode is a bar in the Proportions graph, showing the percentage of mutant vs non-mutant alleles for
 * a gene type in the population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../../axon/js/Property.js';
import Utils from '../../../../../dot/js/Utils.js';
import merge from '../../../../../phet-core/js/merge.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import Color from '../../../../../scenery/js/util/Color.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import naturalSelectionStrings from '../../../naturalSelectionStrings.js';
import HatchingRectangle from '../HatchingRectangle.js';

// constants
const PERCENTAGE_FONT = new PhetFont( 12 );

class ProportionsBarNode extends Node {

  /**
   * @param {Color|string} color
   * @param {Property.<number>} normalCountProperty
   * @param {Property.<number>} mutantCountProperty
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( color, normalCountProperty, mutantCountProperty, valuesVisibleProperty, options ) {

    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );
    assert && assert( normalCountProperty instanceof Property, 'invalid normalCountProperty' );
    assert && assert( typeof normalCountProperty.value === 'number', 'invalid normalCountProperty.value' );
    assert && assert( mutantCountProperty instanceof Property, 'invalid mutantCountProperty' );
    assert && assert( typeof mutantCountProperty.value === 'number', 'invalid mutantCountProperty.value' );
    assert && assert( valuesVisibleProperty instanceof Property, 'invalid valuesVisibleProperty' );
    assert && assert( typeof valuesVisibleProperty.value === 'boolean', 'invalid valuesVisibleProperty.value' );

    options = merge( {
      barWidth: 120,
      barHeight: 30,

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioReadOnly: true
    }, options );

    // Portions of the bar for normal and mutant counts. normalRectangle remains a fixed size. mutantRectangle
    // will be resized and is on top of normalRectangle.
    const normalRectangle = new Rectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );
    const mutantRectangle = new HatchingRectangle( 0, 0, options.barWidth, options.barHeight, {
      fill: color,
      stroke: color
    } );

    // Percentages for non-mutant and mutant counts
    const percentageOptions = {
      font: PERCENTAGE_FONT,
      bottom: -4,
      maxWidth: 40 // determined empirically
    };
    const normalPercentageNode = new Text( '', merge( {}, percentageOptions, {
      tandem: options.tandem.createTandem( 'normalPercentageNode' )
    } ) );
    const mutantPercentageNode = new Text( '', merge( {}, percentageOptions, {
      tandem: options.tandem.createTandem( 'mutantPercentageNode' )
    } ) );

    assert && assert( !options.children, 'ProportionsBarNode sets children' );
    options.children = [ normalRectangle, mutantRectangle, normalPercentageNode, mutantPercentageNode ];

    super( options );

    // @private
    this.normalRectangle = normalRectangle;
    this.mutantRectangle = mutantRectangle;
    this.normalPercentageNode = normalPercentageNode;
    this.mutantPercentageNode = mutantPercentageNode;
    this.barWidth = options.barWidth;

    Property.multilink( [ normalCountProperty, mutantCountProperty, valuesVisibleProperty ],
      ( normalCount, mutantCount, valuesVisible ) =>
        this.update( normalCount, mutantCount, valuesVisible )
    );
  }

  /**
   * @public
   * @override
   */
  dispose() {
    assert && assert( false, 'ProportionsBarNode does not support dispose' );
  }

  /**
   * Updates this node. Note that only mutantRectangle is resized.
   * @param {number} normalCount
   * @param {number} mutantCount
   * @param {boolean} valuesVisible
   * @private
   */
  update( normalCount, mutantCount, valuesVisible ) {

    const total = normalCount + mutantCount;

    const normalPercentage = 100 * normalCount / total;
    const mutantPercentage = 100 * mutantCount / total;

    // hide zero-length bar
    this.normalRectangle.visible = ( normalPercentage > 0 );
    this.mutantRectangle.visible = ( mutantPercentage > 0 );

    // hide N% values, when values are not visible, or when values are zero
    this.normalPercentageNode.visible = ( valuesVisible && normalPercentage > 0 );
    this.mutantPercentageNode.visible = ( valuesVisible && mutantPercentage > 0 );

    // update the mutant portion of the bar and the N% values
    if ( mutantPercentage > 0 && mutantPercentage < 1 ) {

      // 1% mutant
      this.mutantRectangle.rectWidth = 0.01 * this.barWidth;

      // > 99% non-mutant, < 1% mutant
      this.normalPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.greaterThanValuePercent, { value: 99 } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.lessThanValuePercent, { value: 1 } );
    }
    else if ( normalPercentage > 0 && normalPercentage < 1 ) {

      // 99% mutant
      this.mutantRectangle.rectWidth = 0.99 * this.barWidth;

      // < 1% non-mutant, > 99% mutant
      this.normalPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.lessThanValuePercent, { value: 1 } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.greaterThanValuePercent, { value: 99 } );
    }
    else {

      if ( this.mutantRectangle.visible ) {
        this.mutantRectangle.rectWidth = ( Utils.roundSymmetric( mutantPercentage ) / 100 ) * this.barWidth;
      }
      else {
        this.mutantRectangle.rectWidth = 1; // small non-zero, for layout
      }

      // round both percentages to the nearest integer
      this.normalPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.valuePercent, {
        value: Utils.roundSymmetric( normalPercentage )
      } );
      this.mutantPercentageNode.text = StringUtils.fillIn( naturalSelectionStrings.valuePercent, {
        value: Utils.roundSymmetric( mutantPercentage )
      } );
    }
    this.mutantRectangle.right = this.normalRectangle.right;

    // center N% above its portion of the bar
    if ( normalPercentage > 0 ) {
      this.normalPercentageNode.centerX = ( normalPercentage / 100 ) * ( this.barWidth / 2 );
    }
    if ( mutantPercentage > 0 ) {
      this.mutantPercentageNode.centerX = this.barWidth - ( ( mutantPercentage / 100 ) * ( this.barWidth / 2 ) );
    }

    // horizontally constrain N% to left and right edges of bars
    if ( this.normalPercentageNode.left < this.normalRectangle.left ) {
      this.normalPercentageNode.left = this.normalRectangle.left;
    }
    else if ( this.normalPercentageNode.right > this.normalRectangle.right ) {
      this.normalPercentageNode.right = this.normalRectangle.right;
    }

    if ( this.mutantPercentageNode.left < this.normalRectangle.left ) {
      this.mutantPercentageNode.left = this.normalRectangle.left;
    }
    else if ( this.mutantPercentageNode.right > this.normalRectangle.right ) {
      this.mutantPercentageNode.right = this.normalRectangle.right;
    }
  }
}

naturalSelection.register( 'ProportionsBarNode', ProportionsBarNode );
export default ProportionsBarNode;