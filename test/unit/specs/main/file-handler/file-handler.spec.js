import sinon from 'sinon';
import { promises as fs } from 'fs';
import electron from 'electron';
import FileHandler from '../../../../../src/main/file-handler/file-handler';

const SELECTED_FILE_PATH = 'file';
const PAYLOAD = 'payload';
let sandbox;

describe('save', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    delete electron.dialog;
  });

  afterEach(() => {
    sandbox.restore();
  });

  function stubShowSaveDialog(result) {
    const showSaveDialogStub = sandbox.stub();
    showSaveDialogStub.resolves(result);
    electron.dialog = { showSaveDialog: showSaveDialogStub };
    return showSaveDialogStub;
  }

  it('returns cancelled result when save dialog is cancelled', async () => {
    const showSaveDialogStub = stubShowSaveDialog({ canceled: true });
    const writeFileStub = sandbox.stub(fs, 'writeFile');

    const result = await new FileHandler(PAYLOAD).save();

    assert(writeFileStub.notCalled);
    assert(showSaveDialogStub.called);
    expect(result.cancelled).to.eql(true);
    expect(result.filePath).to.eql(null);
    expect(result.error).to.eql(null);
  });

  it('saves payload to file and returns successful result when save dialog succeeded', async () => {
    const showSaveDialogStub = stubShowSaveDialog({ filePath: SELECTED_FILE_PATH });
    const writeFileStub = sandbox.stub(fs, 'writeFile');

    const result = await new FileHandler(PAYLOAD).save();

    assert(showSaveDialogStub.called);
    assert(writeFileStub.calledWith(SELECTED_FILE_PATH, PAYLOAD, 'utf8'));
    expect(result.cancelled).to.eql(false);
    expect(result.filePath).to.eql(SELECTED_FILE_PATH);
    expect(result.error).to.eql(null);
  });

  it('returns error result when writeFile fails', async () => {
    const error = { failed: true };
    const showSaveDialogStub = stubShowSaveDialog({ filePath: SELECTED_FILE_PATH });
    const writeFileStub = sandbox.stub(fs, 'writeFile').throws(error);

    const result = await new FileHandler(PAYLOAD).save();

    assert(showSaveDialogStub.called);
    assert(writeFileStub.calledWith(SELECTED_FILE_PATH, PAYLOAD, 'utf8'));
    expect(result.cancelled).to.eql(false);
    expect(result.filePath).to.eql(SELECTED_FILE_PATH);
    expect(result.error).to.eql(error);
  });
});
