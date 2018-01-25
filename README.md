# Clipper Fpoint
_AKA ClipperJS with Floating Point Support_

## Installation

This package is a mirror of https://sourceforge.net/projects/jsclipper/files/Javascript_Clipper_6.4.2.2_fpoint.zip and includes CommonJS, ES and UMD

#### Node

http://npm.im/clipper-fpoint

`yarn add clipper-fpoint`

`ìmport ClipperLib from 'clipper-fpoint';`

#### Browser

`<script type="text/javascript" src="https://unpkg.com/clipper-fpoint@6.4.2.2/dist/clipper-fpoint.umd.js"></script>`

## Usage

https://sourceforge.net/p/jsclipper/wiki/documentation

### Release Notes

> v6.4.2.2 FPoint (8 September 2017) * The first release of FPoint Javascript Clipper * IntPoint -> FPoint, IntRect -> FRect, DoublePoint -> FPoint * Int128 is removed, the unminified source code is 2000 rows smaller (7600 -> 5600) * Coordinate range +-4.503599627370495e+15 -> +-1.3407807929942596e+154 - Small values around origin are not allowed. Minimum value is +-2.2227587494850775e-162. * Speedup compared to IntPoint-version: 2.16x when using Int128, 1.08x otherwise (Chrome Mac). * No need to round up and down coordinates

https://sourceforge.net/projects/jsclipper/files
