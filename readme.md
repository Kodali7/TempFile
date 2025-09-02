# Introduction

TempFile is a Chrome extension designed to help manage temporary, one-time-use downloads. Instead of cluttering your Downloads folder, it redirects files into a dedicated temporary subfolder, making it easier to delete them later.

## Installation
	1.  Clone or download this repository.
	2.	Open Chrome Extensions (chrome://extensions/).
	3.	Enable Developer mode (top-right).
	4.	Click Load unpacked and select this project’s folder.
	5.	Ensure the Downloads/temp/here folder exists on your system.

## Features
- Redirects downloads into a Downloads/temp/here folder.
- One-click toggle (slider) to enable or disable interception.
- Avoids duplicate downloads with intelligent filename handling.
- Supports automatic cleanup by deleting the here subfolder manually.
- Lightweight and simple – no extra setup required.

## Usage
1. Create the following folder structure in your Downloads directory:

2. Enable TempFile via the extension’s slider.
   - ON → All downloads will be intercepted and stored in temp/here.
   - OFF → Downloads proceed normally.
3. To clear temporary files, simply delete the here folder and recreate it.
