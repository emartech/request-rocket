import sinon from 'sinon';
import { promises as fs } from 'fs';
import electron from 'electron';
import FileLoader from '../../../../../src/main/file-handler/file-loader';

const SELECTED_FILE_PATH = 'file';
const PAYLOAD = 'payload';
let sandbox;

describe('load', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    delete electron.dialog;
  });

  afterEach(() => {
    sandbox.restore();
  });

  function stubShowOpenDialog(result) {
    const showOpenDialogStub = sandbox.stub();
    showOpenDialogStub.resolves(result);
    electron.dialog = { showOpenDialog: showOpenDialogStub };
    return showOpenDialogStub;
  }

  it('returns cancelled result when open dialog is cancelled', async () => {
    const showOpenDialogStub = stubShowOpenDialog({ canceled: true });
    const readFileStub = sandbox.stub(fs, 'readFile');

    const result = await new FileLoader().load();

    assert(readFileStub.notCalled);
    assert(showOpenDialogStub.called);
    expect(result.cancelled).to.eql(true);
    expect(result.rawFileContent).to.eql(null);
    expect(result.error).to.eql(null);
  });

  it('returns raw file content when open dialog succeeded', async () => {
    const showOpenDialogStub = stubShowOpenDialog({ filePaths: [SELECTED_FILE_PATH] });
    const readFileStub = sandbox.stub(fs, 'readFile').resolves(PAYLOAD);

    const result = await new FileLoader().load();

    assert(showOpenDialogStub.called);
    assert(readFileStub.calledWith(SELECTED_FILE_PATH, 'utf8'));
    expect(result.cancelled).to.eql(false);
    expect(result.rawFileContent).to.eql(PAYLOAD);
    expect(result.error).to.eql(null);
  });

  it('returns error result when readFile fails', async () => {
    const error = { failed: true };
    const showOpenDialogStub = stubShowOpenDialog({ filePaths: [SELECTED_FILE_PATH] });
    const readFileStub = sandbox.stub(fs, 'readFile').throws(error);

    const result = await new FileLoader().load();

    assert(showOpenDialogStub.called);
    assert(readFileStub.calledWith(SELECTED_FILE_PATH, 'utf8'));
    expect(result.cancelled).to.eql(false);
    expect(result.rawFileContent).to.eql(null);
    expect(result.error).to.eql(error);
  });
});
