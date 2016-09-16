'use strict'

describe('/#/complain', function () {
  var path = require('path')
  var message, file, submitButton
  var fileSizeErrorMessage, fileTypeErrorMessage

  protractor.beforeEach.login({ email: 'admin@juice-sh.op', password: 'admin123' })

  beforeEach(function () {
    browser.get('/#/complain')
    message = element(by.model('complaint.message'))
    file = element(by.model('file'))
    submitButton = element(by.id('submitButton'))
    fileSizeErrorMessage = element(by.css('[ng-show="form.file.$error.maxSize"]'))
    fileTypeErrorMessage = element(by.css('[ng-show="form.file.$error.pattern"]'))
  })

  describe('untampered file upload form', function () {
    it('can handle PDFs smaller than 1 MB regularly', function () {
      var filename = path.resolve(__dirname, '../files/validSizeAndTypeForClient.pdf')

      message.sendKeys('Uploading small PDF attachment...')
      file.sendKeys(filename)

      expect(fileSizeErrorMessage.isDisplayed()).toBe(false)
      expect(fileTypeErrorMessage.isDisplayed()).toBe(false)
      submitButton.click()
    })

    xit('should not be possible to upload files greater 1 MB', function () {  // FIXME Fails on SauceLabs only
      var filename = path.resolve(__dirname, '../files/invalidSizeForClient.pdf')

      message.sendKeys('Cannot upload 1.5 MB attachment!')
      file.sendKeys(filename)

      expect(fileSizeErrorMessage.isDisplayed()).toBe(true)
      expect(fileTypeErrorMessage.isDisplayed()).toBe(false)
    })

    it('should not be possible to upload files with other extension than .pdf', function () {
      var filename = path.resolve(__dirname, '../files/invalidTypeForClient.qeg')

      message.sendKeys('Cannot upload .qeg attachment!')
      file.sendKeys(filename)

      expect(fileTypeErrorMessage.isDisplayed()).toBe(true)
      expect(fileSizeErrorMessage.isDisplayed()).toBe(false)
    })
  })

  describe('challenge "uploadSize"', function () {
    xit('should be possible to upload files greater 1 MB', function () { // FIXME Replace with multipart backend request?
      browser.executeScript('document.getElementById("file").removeAttribute("ngf-max-size");')
      var filename = path.resolve(__dirname, '../files/invalidSizeForClient.pdf')

      message.sendKeys('Uploading 1.5 MB attachment...')
      file.sendKeys(filename)

      expect(fileSizeErrorMessage.isDisplayed()).toBe(false)
      expect(fileTypeErrorMessage.isDisplayed()).toBe(false)
      submitButton.click()

      protractor.expect.challengeSolved({ challenge: 'uploadSize' })
    })
  })

  describe('challenge "uploadType"', function () {
    xit('should be possible to upload files with other extension than .pdf', function () { // FIXME Replace with multipart backend request?
      browser.executeScript('document.getElementById("file").removeAttribute("ngf-pattern");')
      browser.executeScript('document.getElementById("file").removeAttribute("ngf-accept");')
      var filename = path.resolve(__dirname, '../files/invalidTypeForClient.qeg')

      message.sendKeys('Uploading .qeg attachment...')
      file.sendKeys(filename)

      expect(fileSizeErrorMessage.isDisplayed()).toBe(false)
      expect(fileTypeErrorMessage.isDisplayed()).toBe(false)
      submitButton.click()

      protractor.expect.challengeSolved({ challenge: 'uploadType' })
    })
  })

  describe('challenge "uploadAnonymous"', function () {
    xit('should be possible to upload clickme.html anonymously', function () { // FIXME Replace with multipart backend request?
      browser.get('/#/logout')
      browser.get('/#/complain')

      browser.executeScript('document.getElementById("file").removeAttribute("ngf-pattern");')
      browser.executeScript('document.getElementById("file").removeAttribute("ngf-accept");')
      var filename = path.resolve(__dirname, '../files/clickme.html')

      message.sendKeys('Anonymously uploading clickme.html...')
      file.sendKeys(filename)

      submitButton.click()

      protractor.expect.challengeSolved({ challenge: 'uploadAnonymous' })
    })
  })
})
