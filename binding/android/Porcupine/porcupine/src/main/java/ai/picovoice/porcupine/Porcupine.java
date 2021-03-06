/*
    Copyright 2021 Picovoice Inc.

    You may not use this file except in compliance with the license. A copy of the license is
    located in the "LICENSE" file accompanying this source.

    Unless required by applicable law or agreed to in writing, software distributed under the
    License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
    express or implied. See the License for the specific language governing permissions and
    limitations under the License.
*/

package ai.picovoice.porcupine;

import android.content.Context;
import android.content.res.Resources;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Arrays;
import java.util.HashMap;

/**
 * Android binding for Porcupine wake word engine. It detects utterances of given keywords within an
 * incoming stream of audio in real-time. It processes incoming audio in consecutive frames and for
 * each frame emits the detection result. The number of samples per frame can be attained by calling
 * {@link #getFrameLength()}. The incoming audio needs to have a sample rate equal to
 * {@link #getSampleRate()} and be 16-bit linearly-encoded. Porcupine operates on single-channel
 * audio.
 */
public class Porcupine {

    private static final int[] KEYWORDS_RESOURCES = {
            R.raw.alexa, R.raw.americano, R.raw.blueberry, R.raw.bumblebee, R.raw.computer, R.raw.grapefruit,
            R.raw.grasshopper, R.raw.hey_google, R.raw.hey_siri, R.raw.jarvis, R.raw.ok_google, R.raw.picovoice,
            R.raw.porcupine, R.raw.terminator,
    };
    private static final HashMap<BuiltInKeyword, String> BUILT_IN_KEYWORD_PATHS = new HashMap<>();

    private static String DEFAULT_MODEL_PATH;
    private static boolean isExtracted;

    static {
        System.loadLibrary("pv_porcupine");
    }

    private final long handle;

    /**
     * Constructor.
     *
     * @param modelPath     Absolute path to the file containing model parameters.
     * @param keywordPaths  Absolute paths to keyword model files.
     * @param sensitivities Sensitivities for detecting keywords. Each value should be a number
     *                      within [0, 1]. A higher sensitivity results in fewer misses at the cost
     *                      of increasing the false alarm rate.
     * @throws PorcupineException if there is an error while initializing Porcupine.
     */
    private Porcupine(String modelPath, String[] keywordPaths, float[] sensitivities) throws PorcupineException {
        try {
            handle = init(modelPath, keywordPaths, sensitivities);
        } catch (Exception e) {
            throw new PorcupineException(e);
        }
    }

    /**
     * Releases resources acquired by Porcupine.
     */
    public void delete() {
        delete(handle);
    }

    /**
     * Processes a frame of the incoming audio stream and emits the detection result.
     *
     * @param pcm A frame of audio samples. The number of samples per frame can be attained by
     *            calling {@link #getFrameLength()}. The incoming audio needs to have a sample rate
     *            equal to {@link #getSampleRate()} and be 16-bit linearly-encoded. Porcupine
     *            operates on single-channel audio.
     * @return Index of observed keyword at the end of the current frame. Indexing is 0-based and
     * matches the ordering of keyword models provided to the constructor. If no keyword is detected
     * then it returns -1.
     * @throws PorcupineException if there is an error while processing the audio frame.
     */
    public int process(short[] pcm) throws PorcupineException {
        try {
            return process(handle, pcm);
        } catch (Exception e) {
            throw new PorcupineException(e);
        }
    }

    /**
     * Getter for version.
     *
     * @return Version.
     */
    public native String getVersion();

    /**
     * Getter for number of audio samples per frame..
     *
     * @return Number of audio samples per frame.
     */
    public native int getFrameLength();

    /**
     * Getter for audio sample rate accepted by Picovoice.
     *
     * @return Audio sample rate accepted by Picovoice.
     */
    public native int getSampleRate();

    private native long init(String modelPath, String[] keywordPaths, float[] sensitivities);

    private native void delete(long object);

    private native int process(long object, short[] pcm);

    public enum BuiltInKeyword {
        ALEXA,
        AMERICANO,
        BLUEBERRY,
        BUMBLEBEE,
        COMPUTER,
        GRAPEFRUIT,
        GRASSHOPPER,
        HEY_GOOGLE,
        HEY_SIRI,
        JARVIS,
        OK_GOOGLE,
        PICOVOICE,
        PORCUPINE,
        TERMINATOR
    }

    /**
     * Builder for creating an instance of Porcupine with a mixture of default arguments
     */
    public static class Builder {

        private String modelPath = null;
        private String[] keywordPaths = null;
        private BuiltInKeyword[] keywords = null;
        private float[] sensitivities = null;

        public Builder setModelPath(String modelPath) {
            this.modelPath = modelPath;
            return this;
        }

        public Builder setKeywordPaths(String[] keywordPaths) {
            this.keywordPaths = keywordPaths;
            return this;
        }

        public Builder setKeywordPath(String keywordPaths) {
            this.keywordPaths = new String[]{keywordPaths};
            return this;
        }

        public Builder setKeywords(BuiltInKeyword[] keywords) {
            this.keywords = keywords;
            return this;
        }

        public Builder setKeyword(BuiltInKeyword keyword) {
            this.keywords = new BuiltInKeyword[]{keyword};
            return this;
        }

        public Builder setSensitivities(float[] sensitivities) {
            this.sensitivities = sensitivities;
            return this;
        }

        public Builder setSensitivity(float sensitivity) {
            this.sensitivities = new float[]{sensitivity};
            return this;
        }

        private void extractResources(Context context) throws PorcupineException {
            final Resources resources = context.getResources();

            try {
                for (final int x : KEYWORDS_RESOURCES) {
                    final String keywordName = resources.getResourceEntryName(x);
                    final String keywordPath = copyResourceFile(context, x, keywordName + ".ppn");
                    BUILT_IN_KEYWORD_PATHS.put(BuiltInKeyword.valueOf(keywordName.toUpperCase()), keywordPath);
                }

                DEFAULT_MODEL_PATH = copyResourceFile(context,
                        R.raw.porcupine_params,
                        resources.getResourceEntryName(R.raw.porcupine_params) + ".pv");

                isExtracted = true;
            } catch (IOException ex) {
                throw new PorcupineException(ex);
            }
        }

        private String copyResourceFile(Context context, int resourceId, String filename) throws IOException {
            InputStream is = new BufferedInputStream(context.getResources().openRawResource(resourceId), 256);
            OutputStream os = new BufferedOutputStream(context.openFileOutput(filename, Context.MODE_PRIVATE), 256);
            int r;
            while ((r = is.read()) != -1) {
                os.write(r);
            }
            os.flush();

            is.close();
            os.close();

            return new File(context.getFilesDir(), filename).getAbsolutePath();
        }

        /**
         * Validates properties and creates an instance of the Porcupine wake word engine.
         *
         * @param context Android app context (for extracting Porcupine resources)
         * @return An instance of Porcupine wake word engine
         * @throws PorcupineException if there is an error while initializing Porcupine.
         */
        public Porcupine build(Context context) throws PorcupineException {

            if (!isExtracted) {
                extractResources(context);
            }

            if (modelPath == null) {
                modelPath = DEFAULT_MODEL_PATH;
            }

            if (this.keywordPaths != null && this.keywords != null) {
                throw new PorcupineException(new IllegalArgumentException("Both 'keywords' and 'keywordPaths' were set. " +
                        "Only one of the two arguments may be set for initialization."));
            }

            if (this.keywordPaths == null) {
                if (this.keywords == null) {
                    throw new PorcupineException(new IllegalArgumentException("Either 'keywords' or " +
                            "'keywordPaths' must be set."));
                }

                this.keywordPaths = new String[keywords.length];
                for (int i = 0; i < keywords.length; i++) {
                    this.keywordPaths[i] = BUILT_IN_KEYWORD_PATHS.get(keywords[i]);
                }
            }

            if (sensitivities == null) {
                sensitivities = new float[keywordPaths.length];
                Arrays.fill(sensitivities, 0.5f);
            }

            if (sensitivities.length != keywordPaths.length) {
                throw new PorcupineException(new IllegalArgumentException(String.format("Number of keywords (%d) " +
                        "does not match number of sensitivities (%d)", keywordPaths.length, sensitivities.length)));
            }

            return new Porcupine(modelPath, keywordPaths, sensitivities);
        }
    }
}
