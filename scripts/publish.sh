#
# Copyright (c) Carmentis. All rights reserved.
# Licensed under the Apache 2.0 licence.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
#

VERSION=$(grep "[0-9].[0-9].[0-9]" wxt.config.ts -o)
echo "[🚀] Launching v$VERSION release script"

# Check for uncommitted changes
if [[ -z $(git status --porcelain) ]]; then
    echo "You have uncommitted changes:"
    git status --short

    echo "Commit your changes before to publish."
else

    # Ask for confirmation
    read -p "Do you want to publish version $VERSION? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
      echo "git push origin :refs/tags/v$VERSION"
      echo "git tag --annotate --cleanup=whitespace --edit --message "Release v$VERSION" --force v$VERSION"
      echo "[🚀] The tag associated with the release has been created."
    else
        echo "Abort"
    fi

fi
