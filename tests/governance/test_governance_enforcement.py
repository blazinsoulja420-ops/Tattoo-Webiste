import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[2]
VALIDATOR = ROOT / "scripts/validate_governance.py"

spec = importlib.util.spec_from_file_location("validate_governance", VALIDATOR)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class GovernanceEnforcementTests(unittest.TestCase):
    def test_canonical_binding_validates(self):
        self.assertTrue(module.validate())

    def test_canonical_versions_are_locked(self):
        self.assertEqual(module.EXPECTED["stack"], "1.0.1")
        self.assertEqual(module.EXPECTED["upgs"], "3.1.1")
        self.assertEqual(module.EXPECTED["uprs"], "2.2.1")
        self.assertEqual(module.EXPECTED["upos"], "1.1.1")

    def test_project_identity_is_stable(self):
        self.assertEqual(module.EXPECTED_PROJECT, "UP-TATTOO-001")

if __name__ == "__main__":
    unittest.main()
