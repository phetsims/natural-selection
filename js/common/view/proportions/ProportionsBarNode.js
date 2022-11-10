// Copyright 2019-2022, University of Colorado Boulder

// @ts-nocheck
/**
 * ProportionsBarNode is a bar in the Proportions graph, showing the percentage of mutant vs non-mutant alleles for
 * a gene in the population.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Multilink from '../../../../../axon/js/Multilink.js';
import Utils from '../../../../../dot/js/Utils.js';
import merge from '../../../../../phet-core/js/merge.js';
import AssertUtils from '../../../../../phetcommon/js/AssertUtils.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { Color, Node, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import Tandem from '../../../../../tandem/js/Tandem.js';
import naturalSelection from '../../../naturalSelection.js';
import NaturalSelectionStrings from '../../../NaturalSelectionStrings.js';
import NaturalSelectionUtils from '../../NaturalSelectionUtils.js';
import HatchingRectangle from '../HatchingRectangle.js';

// constants
const PERCENTAGE_FONT = new PhetFont( 12 );

export default class ProportionsBarNode extends Node {

  /**
   * @param {Color|string} color
   * @param {number} normalCount
   * @param {number} mutantCount
   * @param {Property.<boolean>} valuesVisibleProperty
   * @param {Object} [options]
   */
  constructor( color, normalCount, mutantCount, valuesVisibleProperty, options ) {

    assert && assert( color instanceof Color || typeof color === 'string', 'invalid color' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );
    assert && AssertUtils.assertPropertyOf( valuesVisibleProperty, 'boolean' );

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

    // Percentages for non-mutant and mutant counts.
    // These Text nodes do not take a string Property argument. They are updated via Multilink below.
    const percentageOptions = {
      font: PERCENTAGE_FONT,
      bottom: -4,
      maxWidth: 40 // determined empirically
    };
    const normalPercentageText = new Text( '', merge( {}, percentageOptions, {
      tandem: options.tandem.createTandem( 'normalPercentageText' )
    } ) );
    const mutantPercentageText = new Text( '', merge( {}, percentageOptions, {
      tandem: options.tandem.createTandem( 'mutantPercentageText' )
    } ) );

    assert && assert( !options.children, 'ProportionsBarNode sets children' );
    options.children = [ normalRectangle, mutantRectangle, normalPercentageText, mutantPercentageText ];

    super( options );

    // @private
    this.normalRectangle = normalRectangle;
    this.mutantRectangle = mutantRectangle;
    this.normalPercentageText = normalPercentageText;
    this.mutantPercentageText = mutantPercentageText;
    this.barWidth = options.barWidth;
    this.normalCount = normalCount;
    this.mutantCount = mutantCount;
    this.valuesVisibleProperty = valuesVisibleProperty;

    // When valuesVisibleProperty changes, or any of the related strings change, update the display.
    // unlink is not necessary.
    Multilink.multilink( [
        this.valuesVisibleProperty,
        NaturalSelectionStrings.greaterThanValuePercentStringProperty,
        NaturalSelectionStrings.lessThanValuePercentStringProperty,
        NaturalSelectionStrings.valuePercentStringProperty
      ],
      () => this.updateProportionsBarNode()
    );
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
   * Sets the counts and triggers an update of the display.
   * @param {number} normalCount
   * @param {number} mutantCount
   * @public
   */
  setCounts( normalCount, mutantCount ) {
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( normalCount ), 'invalid normalCount' );
    assert && assert( NaturalSelectionUtils.isNonNegativeInteger( mutantCount ), 'invalid mutantCount' );

    this.normalCount = normalCount;
    this.mutantCount = mutantCount;
    this.updateProportionsBarNode();
  }

  /**
   * Resizes the bars and displays the counts as percentages.
   * @private
   */
  updateProportionsBarNode() {

    const total = this.normalCount + this.mutantCount;

    const normalPercentage = 100 * this.normalCount / total;
    const mutantPercentage = 100 * this.mutantCount / total;

    // hide zero-length bar
    this.normalRectangle.visible = ( normalPercentage > 0 );
    this.mutantRectangle.visible = ( mutantPercentage > 0 );

    // hide N% values, when values are not visible, or when values are zero
    this.normalPercentageText.visible = ( this.valuesVisibleProperty.value && normalPercentage > 0 );
    this.mutantPercentageText.visible = ( this.valuesVisibleProperty.value && mutantPercentage > 0 );

    // update the mutant portion of the bar and the N% values
    if ( mutantPercentage > 0 && mutantPercentage < 1 ) {

      // 1% mutant
      this.mutantRectangle.rectWidth = 0.01 * this.barWidth;

      // > 99% non-mutant, < 1% mutant
      this.normalPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.greaterThanValuePercentStringProperty.value, { value: 99 } );
      this.mutantPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.lessThanValuePercentStringProperty.value, { value: 1 } );
    }
    else if ( normalPercentage > 0 && normalPercentage < 1 ) {

      // 99% mutant
      this.mutantRectangle.rectWidth = 0.99 * this.barWidth;

      // < 1% non-mutant, > 99% mutant
      this.normalPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.lessThanValuePercentStringProperty.value, { value: 1 } );
      this.mutantPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.greaterThanValuePercentStringProperty.value, { value: 99 } );
    }
    else {

      if ( this.mutantRectangle.visible ) {
        this.mutantRectangle.rectWidth = ( Utils.roundSymmetric( mutantPercentage ) / 100 ) * this.barWidth;
      }
      else {
        this.mutantRectangle.rectWidth = 1; // small non-zero, for layout
      }

      // round both percentages to the nearest integer
      this.normalPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.valuePercentStringProperty.value, {
        value: Utils.roundSymmetric( normalPercentage )
      } );
      this.mutantPercentageText.text = StringUtils.fillIn( NaturalSelectionStrings.valuePercentStringProperty.value, {
        value: Utils.roundSymmetric( mutantPercentage )
      } );
    }
    this.mutantRectangle.right = this.normalRectangle.right;

    // center N% above its portion of the bar
    if ( normalPercentage > 0 ) {
      this.normalPercentageText.centerX = ( normalPercentage / 100 ) * ( this.barWidth / 2 );
    }
    if ( mutantPercentage > 0 ) {
      this.mutantPercentageText.centerX = this.barWidth - ( ( mutantPercentage / 100 ) * ( this.barWidth / 2 ) );
    }

    // horizontally constrain N% to left and right edges of bars
    if ( this.normalPercentageText.left < this.normalRectangle.left ) {
      this.normalPercentageText.left = this.normalRectangle.left;
    }
    else if ( this.normalPercentageText.right > this.normalRectangle.right ) {
      this.normalPercentageText.right = this.normalRectangle.right;
    }

    if ( this.mutantPercentageText.left < this.normalRectangle.left ) {
      this.mutantPercentageText.left = this.normalRectangle.left;
    }
    else if ( this.mutantPercentageText.right > this.normalRectangle.right ) {
      this.mutantPercentageText.right = this.normalRectangle.right;
    }
  }
}

naturalSelection.register( 'ProportionsBarNode', ProportionsBarNode );