from globale.auth.tests.auth_backends import (BackendTest,
    RowlevelBackendTest, AnonymousUserBackendTest, NoAnonymousUserBackendTest,
    NoBackendsTest, InActiveUserBackendTest, NoInActiveUserBackendTest)
from globale.auth.tests.basic import BasicTestCase
from globale.auth.tests.decorators import LoginRequiredTestCase
from globale.auth.tests.forms import (UserCreationFormTest,
    AuthenticationFormTest, SetPasswordFormTest, PasswordChangeFormTest,
    UserChangeFormTest, PasswordResetFormTest)
from globale.auth.tests.remote_user import (RemoteUserTest,
    RemoteUserNoCreateTest, RemoteUserCustomTest)
from globale.auth.tests.models import ProfileTestCase
from globale.auth.tests.signals import SignalTestCase
from globale.auth.tests.tokens import TokenGeneratorTest
from globale.auth.tests.views import (PasswordResetTest,
    ChangePasswordTest, LoginTest, LogoutTest, LoginURLSettings)
from globale.auth.tests.permissions import TestAuthPermissions

# The password for the fixture data users is 'password'
